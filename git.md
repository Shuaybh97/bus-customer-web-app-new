## create your ssh key locally
# Generate a new SSH key (press Enter to accept default file location)
ssh-keygen -t ed25519 -C "your_email@example.com"
# Start the ssh-agent in the background
eval "$(ssh-agent -s)"
# Add your SSH private key to the ssh-agent
ssh-add ~/.ssh/id_ed25519
# Copy your public key to clipboard (macOS)
pbcopy < ~/.ssh/id_ed25519.pub
# Add the copied key to your GitHub SSH keys (in GitHub website)


## after ssh
git pull  git@github.com:Shuaybh97/bus-customer-web-app-new.git

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
