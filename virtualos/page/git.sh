{
"text":
[
["sudo apt-get install git-all","install git on Debian based distro with this command"],
["git init","create a new local repository"],
["git config --global user.name \"pista\"","set your username what your use on github.com too, in this case it is <b>pista</b>"],
["git config --global user.email \"pista@gmail.com\"","set your email what your use on github.com too, in this case it is <b>pista@gmail.com</b>"],
["git remote add MyRepo https://github.com/pista/myfirstrepo.git","set the remote repository, what you created on github.com, only we use <b>.git</b> suffix, in this command we give like a shortname for this long adress, when <b>MyRepo</b> will be used, we refer to our remote repo"],
["git add *.php","this command add all php file in your current directory to your local repo"],
["git commit -m \"our init files\"","we must assign message to every changed file since last changes, in our case every php file what we added before"],
["git push MyRepo master","we upload every changes (this case all added php file with commit messages) to our remote repo to master branch (primary branch), so finally everything same on your local & on your remote repo"]
]
}
