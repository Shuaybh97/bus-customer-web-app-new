## create a new branch and adding that branch to origin (remote github website)
git checkout -b your-branch-name

git add . 
git status
git commit -m "your commit message"
git push origin your-branch-name

## when making a change 
git add . 
git status
git commit -m "your commit message"
git push

## checking changes
# See what files have changed (unstaged and staged)
git status
# See the actual changes (diff) in files
git diff

## delete a branch
# Delete a local branch
git branch -d branch-name
