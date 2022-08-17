---
title: react-context
date: 2021-11-26 17:29:39
tags:
  - mobx
  - hooks
---

## 前言

还记得我第一次上课程项目时，刚刚上手react，那时候还不知道啥叫`context`，啥叫`store`，导致项目的所有状态都是通过`props`+`state`传递和管理😂。不用想也能知道，此种用法对于某些类型的属性而言是极其繁琐的（如主题等属性），它们被许多组件所需要，导致我们想要使用它们就不得不将其从父组件一层层往下传。这既不高效，也不优雅。Context被设计出来便是为了解决这些问题。

> Context提供了一种在组件之间共享值的方式，而不必显式地通过组件树的逐层传递props

## 摘要

* [Context 基础](#使用Context的时机) 👈
* [动态 Context](#动态Context值) 👈
* [useContext配合useReducer](#useContext配合useReducer) 👈
* [mobx in react](#mobx-in-react) 👈

## 使用Context的时机

> Context 设计目的是为了共享那些对于一个组件树而言是“全局”的数据，例如当前认证的用户、主题或首选语言。

* 当我们的应用中存在”全局状态“时，可使用context来管理这些数据。如应用主题、首选语言、用户认证等。
* 当我们的一个组件树上的多个组件需要数据交互时，可以使用Context来管理这些数据。如Form组件与Input组件之间的数据交互、Checkbox与CheckboxGroup之间的数据交互等。

## Context 的 API

### createContext

```js
const MyContext = React.createContext(defaultValue)
```

用于创建一个 Context 对象，可传入状态的默认值。

* 当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 `Provider` 中读取到当前的 context 值。
* **只有**当组件所处的树中没有匹配到 Provider 时，其 `defaultValue` 参数才会生效。此默认值有助于在不使用 Provider 包装组件的情况下对组件进行测试。注意：将 `undefined` 传递给 Provider 的 value 时，消费组件的 `defaultValue` 不会生效。

### Context.Provider

```js
<MyContext.Provider value={/* 某个值 */}>
```

每个 Context 对象都会返回一个 Provider React 组件，它允许消费组件订阅 context 的变化。

* Provider 接收一个 `value` 属性，传递给消费组件。一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。
* 当 Provider 的 `value` 值发生变化时，它内部的所有消费组件都会重新渲染。从 Provider 到其内部 consumer 组件（包括 contextType和 useContext）的传播不受制于 `shouldComponentUpdate` 函数，因此当 consumer 组件在其祖先组件跳过更新的情况下也能更新。

### Context.Consumer

```js
<MyContext.Consumer>
  {(state) => /* 基于 context 的 state 值进行渲染*/}
</MyContext.Consumer>
```

一个 React 组件可以订阅 context 的变更，此组件可以让你在函数式组件中可以订阅 context。

* 接受一个含函数作为子元素。该函数接受当前的 context 值，并返回一个 react 节点。传递给函数的`state`值等价于组件树上方离这个 context 最近的 Provider 提供的 `value` 值。如果没有对应的 Provider，`state` 参数等同于传递给 `createContext()` 的 `defaultValue`。

---

## 动态Context值

Context可以为动态的值。下面是一个完整示例：

```tsx
interface IUser {
  name: string
  age: number
  id: string
}

const Context = createContext(null)

const ContextDemo = () => {
  const [user, setUser] = useState<IUser | null>(null)
  return (
    <Context.Provider value={{ state: user, setState: setUser }}>
      <div className='wrap'>
        <h1>Parent</h1>
        <TestDemo />
      </div>
    </Context.Provider>
  )
}

const TestDemo = () => {
  const [val, setVal] = useState('')
  const [num, setNum] = useState(0)
  return (
    <div>
      <h3>Child</h3>
      <Context.Consumer>
        { ({state, setState}) => {
          return (
            <div className='wrap'>
              <label htmlFor="">姓名</label>
              <input type="text" value={state?.name || ''} />
              <br />
              <label htmlFor="">年龄</label>
              <input type="text" value={state?.age || 0} />
              <hr />
              <input type="text" value={val} onChange={e => setVal(e.target.value)} />
              <button onClick={() => setState(pre => ({ ...pre, name: val }))}>修改姓名</button>
              <input type="text" value={num} onChange={e => setNum(parseInt(e.target.value) || 0)} />
              <button onClick={() => setState(pre => ({ ...pre, age: num }))}>修改年龄</button>
            </div>
          )
        } }
      </Context.Consumer>
    </div>
  )
}
```

---

看到这里，你也许会问，难道我们订阅 Context 只能使用 Consumer 么？组件接受一个函数作为子节点，这也太奇怪了！而且还会多嵌套一层组件，这不够优雅！现在，`useContext`可以帮我们解决这个问题（使用hooks开发）。

## useContext

```js
const state = useContext(MyContext)
```

`useContext`接收一个context对象（`React.createContext`的返回值）并返回该 context 的当前值。 当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 `value` prop 决定。

当组件上层最近的 `<MyContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用最新传递给 `MyContext` provider 的 context `value` 值。即使祖先使用 `React.memo`或 `shouldComponentUpdate`，也会在组件本身使用 `useContext` 时重新渲染。

> **注意：`useContext` 的参数必须是 *context 对象本身*！**

---

依托`useContext`钩子，上述`TestDemo`组件可改写为如下形式：

```tsx
const TestDemo = () => {
  const [val, setVal] = useState("")
  const [num, setNum] = useState(0)
  const { state, setState } = useContext(Context)	// <--
  return (
    <div>
      <h3>Child</h3>
      <div className="wrap">
        <label htmlFor="">姓名</label>
        <input type="text" value={state?.name || ""} />
        <br />
        <label htmlFor="">年龄</label>
        <input type="text" value={state?.age || 0} />
        <hr />
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <button onClick={() => setState((pre) => ({ ...pre, name: val }))}>
          修改姓名
        </button>
        <input
          type="text"
          value={num}
          onChange={(e) => setNum(parseInt(e.target.value) || 0)}
        />
        <button onClick={() => setState((pre) => ({ ...pre, age: num }))}>
          修改年龄
        </button>
      </div>
    </div>
  )
}
```



## useReducer

```js
const [state, dispatch] = useReducer(reducer, initialState, init)
```

> `useReducer` 是 `useState` 的替代方案。它接收一个形如 `(state, action) => newState` 的 reducer，并返回当前的 state 以及与其配套的 `dispatch` 方法。

> 同`useState`，如果 Reducer Hook 的返回值与当前 state 相同，React 将跳过子组件的渲染及副作用的执行。

*（这简直跟redux一个模子里刻出来的）*

在某些情况下，`useReducer` 会比 `useState` 更适用，如：

* state逻辑复杂，包含多个子值
* 下一个state依赖之前的state
* ...

你也许注意到了`useReducer`的第三个参数 `init`，是一个函数，它用于惰性创建初始state。如果传入该函数，初始 state 将被设置为`init(initialState)`。

这样做的意义在于可以将用于计算 state 的逻辑提取到 reducer 外部，这也为将来对重置 state 的 action 做处理提供了便利。这里借用官网的例子：

```js
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}

```





## useContext配合useReducer

看完上面的例子你可能会感觉很熟悉，这跟 redux 很像啊😏——都用来维护状态，状态变化时页面都会刷新...

它们确实很像，但`useContext`配合`useReducer`能够使其更像redux，甚至在某种程度上代替redux。

如下面的例子：

```tsx
interface IUser {
  name: string;
  age: number;
  id: string;
}

interface IAction {
  type: string
  payload: any
}

const Context = createContext<{ state: IUser, dispatch: (action: IAction) => void }>(null)

const initialState: IUser = {
  name: '',
  age: 0,
  id: ''
}

const reducer = (state: IUser, action: IAction) => {
  switch(action.type) {
    case 'SET_NAME':
      return {
        ...state,
        name: action.payload
      }
    case 'SET_AGE':
      return {
        ...state,
        age: action.payload
      }
    case 'SET_ID':
      return {
        ...state,
        id: action.payload
      }
    default:
      return state
  }
}

const ContextDemo = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <Context.Provider value={{ state, dispatch }}>
      <TestDemo />
    </Context.Provider>
  )
}

const TestDemo = () => {
  const [val, setVal] = useState("");
  const [num, setNum] = useState(0);
  const { state, dispatch } = useContext(Context)
  return (
    <div>
      <h3>Child</h3>
      <div className="wrap">
        <label htmlFor="">姓名</label>
        <input type="text" value={state?.name || ""} />
        <br />
        <label htmlFor="">年龄</label>
        <input type="text" value={state?.age || 0} />
        <hr />
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <button onClick={() => dispatch({ type: 'SET_NAME', payload: val })}>
          修改姓名
        </button>
        <input
          type="text"
          value={num}
          onChange={(e) => setNum(parseInt(e.target.value) || 0)}
        />
        <button onClick={() => dispatch({ type: 'SET_AGE', payload: num })}>
          修改年龄
        </button>
      </div>
    </div>
  )
}

export default ContextDemo
```



## 后记

看完这篇文章，你可能对其中浅尝辄止的概念感到迷惑。

🤔你可以去往[Context – React (reactjs.org)](https://zh-hans.reactjs.org/docs/context.html)了解更多context知识。

现在，你知道在react下管理全局状态的方法不只有redux和mobx了，`useContext` 配合 `useReducer`也能工作得很好。

🤔你可能对 <a id="mobx-in-react">mobx in react</a> 的写法不是很熟悉，可以去往[mobx、mobx-react和mobx-react-lite新手入门](https://juejin.cn/post/6945720333026459656)了解更多。

