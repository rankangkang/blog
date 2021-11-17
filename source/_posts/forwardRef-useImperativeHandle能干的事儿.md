---
title: forwardRef+useImperativeHandle能干的事儿
date: 2021-11-17 22:31:21
tags: react
  hooks
---

## 前言

前段时间在封装一个文件上传组件时，遇到这样一个问题：需求是需要隐藏`input[type='file']`元素，但需要在点击组件时触发文件上传动作（弹出文件系统）。

这就需要我们把触发`input`元素的点击方法暴露出来以供外部使用，顺理成章的，我想到了 ref，但 ref 不能被作为 props 传递。

那有没有什么办法使得我们能够传递 ref 呢？答案是有的，`React.forewardRef`的工作就是转发 ref。

## forwardRef

正如他的名字一样，`forwardRef`的职责就是转发 ref，它会 创建一个 react 组件 来将其 接收到的 ref 属性 转发到其 组件树下的另一个组件 中。

```jsx
const Upload = React.forwardRef((props, ref) => (
	<div>
        <input type='file' ref={ref} />
    </div>
))

// In other FC
const ref = useRef(null)
// ...
<Upload ref={ref} />
```

如此，我们提供的 ref 属性便经过`forwardRef`转发到了`input`元素，`ref.current` 将直接指向`input`的 DOM 实例。

> 我们已经将 ref 指向`input`元素，那么现在只需要在合适的时候调用元素的`click`方法即可。你会怎么做呢？直接使用`ref.current.click()`调用么？No no no，这样不够优雅。实际上，react 也不建议这样做，因为直接使用`ref`我们能够获取到的不仅仅是我们所需要的获取的，它包括元素的所有属性（方法），这不优雅，更不安全。
>
> 而`useImperativeHandle`能够让它优雅。

## useImperativeHandle

`useImperativeHandle`可以让你在使用`ref`时 自定义暴露给父组件的实例值。

`useImperativeHandle`应当与`forwardRef`一起配合使用。

```js
const Upload = ({ ...props, ref }) => {
    const inputRef = useRef()
    useImperativeHandle(ref, () => {
        // 返回一个对象，内部属性为暴露给父组件的方法
        return {
            // 暴露给父组件的方法
            click: () => {
                inputRef.current.click()
            },
            clear: () => {
                inputRef.current.value = ''
            }
        }
    })
    return (
    	<div>
        	// ... other code
        	<input type='file' style={{ width: 0, height: 0 }} ref={inputRef} />
        </div>
    )
}

Upload = forwardRef((props, ref) => <Upload {...props} ref={ref} />)

// In other Component
const ref = useRef(null)
<Upload ref={ref} />
```

现在你可以调用 `ref.current.click()` 来实现点击上传动作，通过调用 `ref.current.clear()` 来清空文件列表。

## 总结

`forwardRef`与`useImperativeHandle`这俩配合使用能够**最小限度地将子组件的属性\方法暴露给父组件**，避免使用 ref 形式的命令式代码。

`useImperativeHandle` 应当与 `forwardRef` 一起使用。

下面是我封装的 quill 富文本编辑器，支持图片上传（通过向外部暴露`onUpload`方法），以供参考

```tsx
import React, {
  ChangeEvent,
  ForwardedRef,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  memo,
  CSSProperties,
} from 'react'
import Quill, { QuillOptionsStatic } from 'quill'

const id = 'editor-' + new Date().valueOf()
let editor: Quill

interface Props {
  initialText?: string
  onChange: (content: string, textLength?: number, imgLength?: number) => void
  placeholder?: string
  uploadImage?: (
    file: File
  ) => Promise<{ url: string; alt: string } | Error> | any
  editorOptions?: QuillOptionsStatic
  style?: CSSProperties
}

const QuillEditor = memo(
  ({
    initialText,
    onChange,
    placeholder,
    uploadImage,
    editorOptions,
    style,
    onRef,
  }: Props & { onRef: ForwardedRef<any> }) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const fileRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
      let node = editorRef.current as Element
      const options: QuillOptionsStatic = {
        modules: {
          toolbar: false,
        },
        theme: 'snow',
        placeholder: placeholder || '请输入',
      }
      editor = new Quill(node || '#' + id, {
        ...options,
        ...editorOptions,
      })
      !!initialText && editor.setText(initialText)
      editor.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
        const ops: any[] = []
        delta.ops.forEach((op) => {
          if (op.insert && typeof op.insert === 'string') {
            ops.push({
              insert: op.insert,
            })
          }
        })
        delta.ops = ops
        return delta
      })
    }, [editorOptions, placeholder])
    useEffect(() => {
      const handleTextChange = () => {
        const text = editor.getText().replace(/\s/g, '')
        const imgs = editor.root.querySelectorAll('img')
        const content = editor.root.innerHTML
        onChange(content, text.length, imgs.length)
      }
      editor.on('text-change', handleTextChange)
      return () => {
        editor.off('text-change', handleTextChange)
      }
    }, [onChange])

    const insertImage = (url: string) => {
      const selection = editor.getSelection()
      const index = selection ? selection.index : editor.getLength()
      editor.insertEmbed(index, 'image', url)
    }

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      const re = await (uploadImage as Function)(file as File)
      if (re?.url) {
        insertImage(re.url)
      }
      e.target && (e.target.value = '')
    }

    useImperativeHandle(onRef, () => ({
      onUpload: () => {
        fileRef.current?.click()
      },
    }))

    return (
      <div className={'my-quill'}>
        <div
          className={'my-quill_editor'}
          id={id}
          ref={editorRef}
          style={{ ...style }}
        ></div>
        <input
          className={'my-quill_upload'}
          type="file"
          ref={fileRef}
          accept="image/jpeg,image/jpg,image/png,image/gif"
          multiple={false}
          onChange={handleFileChange}
          disabled={!!!uploadImage}
        />
      </div>
    )
  }
)

export default forwardRef((props: Props, ref) => (
  <QuillEditor {...props} onRef={ref} />
))
```
