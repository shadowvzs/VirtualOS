{
"text":
[
["git branch MyNewBranch","create a branch with following name: <b>MyNewBranch</b>"],
["git checkout MyNewBranch","change current branch to <b>MyNewBranch</b>"],
["git branch","list branches:<br><b>master</b><br><b>*MyNewBranch</b>"],
["git checkout MyNewBranch","change current branch to <b>master</b>"],
["git branch","list branches:<br><b>*master</b><br><b>MyNewBranch</b>"],
["git merge MyNewBranch","merge <b>MyNewBranch</b> to <b>master</b> branch"],
["git branch -d MyNewBranch","delete <b>MyNewBranch</b>"],
["git ls-tree master","list tree in <b>master</b> branch<br>use -d for only directory or -r for recurse"],
["git show master","show changes in <b>master</b> branch"],
["git branch Next","create a branch with following name: <b>Next</b>"],
["git checkout Next","change current branch to <b>Next</b>"],
["git add pista13.txt","add a new file to current (<b>Next</b>) branch"],
["git diff master Next","show the difference between <b>master</b> and <b>Next</b> branch"],
["git push myRepo Next","upload <b>Next</b> branch content to your remote repo"],
["git pull MyRepo Next","download changes from remote <b>MyRepo</b> repo, from <b>Next</b> branch to your local repo"],
["git clone -b Next --single-branch MyRepo ./test/","clone <b>Next</b> branch from <b>MyRepo</b> to your local repo test folder"]
]
}
