import React from 'react';
import DisplayResponse from './DisplayResponse';

const Response = () => {
    // Example API response
    const apiResponse = {
        "answer": "Connecting a Git repository (repo) to GitHub is a straightforward process. Here's a step-by-step guide:\n\n*Prerequisites\n\n1. You have already installed Git on your computer.\n2. You have created a new repository on GitHub.\n3. You have the necessary permissions to push changes to the repository.\n\nInstructions\n\nStep 1: Initialize a local Git repository\n\n1. Open a terminal or command prompt on your computer.\n2. Navigate to the directory where your code is stored using the cd command (e.g., cd myproject).\n3. Run the following command to initialize a new Git repository: git init\n\nStep 2: Link your local repo to GitHub\n\n1. Run the following command to link your local repository to your GitHub account:\n\ngit remote add origin https://github.com/yourusername/yourrepo.git\n\n Replace `yourusername` and yourrepo with your actual GitHub username and repository name.\n\nStep 3: Verify the connection\n\n1. Run the following command to verify that the connection is successful:\n\ngit remote -v\n\nThis should display the URL of your GitHub repository.\n\nStep 4: Push changes to GitHub\n\n1. Make some changes to your code (e.g., create a new file or modify an existing one).\n2. Run the following command to commit and push the changes:\n\ngit add .\ngit commit -m \"Initial commit\"\ngit push -u origin master\n\n Replace `master` with the branch name you want to push to.\n\nOptional: Create a new branch\n\nIf you want to create a new branch, run the following commands:\n\ngit branch feature/new-feature\ngit checkout feature/new-feature\ngit add .\ngit commit -m \"New feature\"\ngit push origin feature/new-feature\n\nThis will create a new branch called `feature/new-feature` and push it to GitHub.\n\nTips\n\n Make sure you have write permissions for the repository.\n* Use the -u flag to set the upstream tracking information, which allows Git to automatically track changes between your local repo and the remote one.\n* If you encounter errors during the process, check the Git documentation or online resources for troubleshooting guides."
    }

    return (
        <div>
            <DisplayResponse response={apiResponse} />
        </div>
    );
};

export default Response;
