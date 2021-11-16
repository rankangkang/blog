---
title: git基础
tags: git
date: 2021-07-01 15:37:00
categories: git
---

# git 基础

下面几个概念，简单带过

工作区：存放代码文件的位置。

暂存区：暂存文件的位置，通过`git add`命令将工作区的文件添加到暂存区。

本地仓库：`git commit`命令可将暂存区的代码提交至本地仓库。

远程仓库：托管在代码服务器上的仓库，通过`git push`命令可将本地代码提交至远程仓库。



## 常用命令

1. `git init`：初始化仓库。

2. `git remote` : 常用与远程仓库有关的操作。

   * 为本地仓库添加远程仓库：

     ```
     git remote add origin <your-repos-addr>
     ```

   * 查看远程仓库信息

     ```
     git remote -v
     ```

   * 显示某个远程仓库信息

     ```
     git remote show <your-repos-addr>
     ```

   * 删除远程仓库

     ```
     git remote rm <your-repos-name>
     ```

   * 修改远程仓库

     ```
     git remote rename <old-name> <new-name>
     ```

3. `git config`：获取并设置存储库或全局选项。

   当安装Git后（或与第一次与远程仓库建立连接前）首先要做的事情是设置用户名称和e-mail地址，这些信息永远的嵌入到每一次提交中，所以十分重要。

   ```
   git config --global user.name <your-name>			配置用户名
   git config --global user.email <your-email-addr>	配置邮箱
   ```

   

4. `git clone`：从远程仓库克隆到当前目录

   ```
   git clone <your-repos-addr>
   ```

5. `git fetch`：将远程仓库的最新内容拉到本地，由用户检查并决定是否合并到工作分支。

   ```
   git fetch <your-repos-addr>
   ```

6. `git pull`：从远程主机的最新内容拉到本地，直接强制合并。`git pull` = `git fetch` + `git merge`

   ```
   git pull <your-repos-addr>
   ```

7. `git add`：添加工作区代码进入暂存区。

   * 添加暂存区所有文件

     ```
     git add .
     ```

   * 添加指令文件

     ```
     git add <file-path>
     ```

8. `git status`：查看当前仓库的状态，显示有变更的文件。

9. `git rm`：删除文件。

   * 删除工作区文件

     ```
     git rm <file-path>		删除文件
     fit rm -r <folder-path>	删除文件夹
     ```

   * 删除暂存区文件 

     ```
     git rm -r --cached * 		删除暂存区所有文件
     git rm --cached <file-path>	删除暂存区指定文件
     ```

     

10. `git commit`：添加暂存区代码进入本地仓库。

   ```
   git commit -m "<commit-infos>"
   ```

11. `git push`：推送本地仓库代码到远程仓库。

    ```
    git push -u origin <branch-name>
    或
    git push origin <branch-name>
    ```

    * 本地版本与远程版本有差异，但又要 强制推送

      ```
      git push --force origin <branch-name>
      ```

12. `git log`：查看历史提交记录。

13. `git branch`：从当前分支新建分支，分支内容为当前分支的内容。

    ```
    git branch <new-branch-name>
    ```

    * 删除分支

      ```
      git branch -d <branch-name>
      ```

      

14. `git checkout`：从当前切换到指定分支。

    ```
    git checkout <branch-name>
    ```

    * 创建新分支并切换到该分支

      ```
      git checkout -b <new-branch-name>
      ```

15. `git merge`：合并指定分支到当前分支。

    ```
    git merge <other-branch-name>
    ```

16. `git rebase`：在另一个分支基础之上重新应用，把一个分支的修改合并到当前分支。详情见[git rebase命令 - Git教程™ (yiibai.com)](https://www.yiibai.com/git/git_rebase.html)。

    多看，不然会忘^-^



## http(s)与ssh

在浏览github遇到比较感兴趣的项目（或自己的项目）时，我通常会把工程拉到本地，方便阅读源码。每次拉代码的时候都会注意到github提供的两种拉取方式：http(s)与ssh。

这两者的区别在于：

* 使用https url克隆对初学者来说会比较方便，复制https url然后到git Bash里面直接用clone命令克隆到本地就好了，但是每次fetch和push代码都需要输入账号和密码，这也是https方式的麻烦之处。

* 而使用SSH url克隆却需要在克隆之前先配置和添加好SSH key，因此，如果你想要使用SSH url克隆的话，你必须是这个项目的拥有者。否则你是无法添加SSH key的，另外ssh默认是每次fetch和push代码都不需要输入账号和密码，如果你想要每次都输入账号密码才能进行fetch和push也可以另外进行设置。

### 添加ssh

1. 检查电脑本地是否已经生成ssh key

   在git bash或终端执行如下命令：

   ```shell
   cd ~/.ssh
   ls
   ```

   若已经存在`id_ras.pub`或`id_dsa.pub`文件，则说明本地存在ssh key。

   若不存在，那么需要先创建一个ssh key.

2. 创建ssh key

   执行命令如下：

   ```shell
   ssh-keygen -t rsa -C <your-email-addr>
   ```

   -t指定密钥类型，默认是rsa，可以省略。 
   -C设置注释文字，比如邮箱。 
   -f指定密钥文件存储文件名。（命令省略了-f参数，因此，运行上面那条命令后会让你输入一个文件名，用于保存刚才生成的SSH key代码。）若使用默认文件名，会生成`id_rsa`和`id_rsa.pub`两个密钥文件。

   创建成功后，去`1`中的`.ssh`文件夹可找到生成的密钥。

3. 添加ssh key到git服务器

   将`id_rsa.pub`文件中的内容拷贝，粘贴到github或其他代码管理平台的ssh key 设置。

4. 测试ssh key

   执行命令如下：

   ```shell
   ssh -T <代码管理平台地址>
   
   # 如：
   ssh -T git@github.com
   ```

   



综上，可以看出添加ssh key还是比较麻烦的，所以很多时候我都直接使用https url克隆到本地，这更加方便；但是在修改自己的项目的时候，还是会用到ssh url克隆。