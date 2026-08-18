# GitHub Push Walkthrough

To complete your 100% cloud deployment, your code needs to be on GitHub so Render can access it. I have already initialized Git on your computer and committed all your files.

Here is the exact manual process to get it onto GitHub:

1. Go to [GitHub.com](https://github.com/) and log in (or create a free account).
2. Click the **+** icon in the top right corner and select **New repository**.
3. Name your repository (e.g., `SaleAi-App`).
4. Leave it as **Public** or **Private** (Render supports both).
5. **DO NOT** check the boxes to add a README, .gitignore, or license (we already have those).
6. Click **Create repository**.
7. You will see a screen with instructions. Look for the section titled **"…or push an existing repository from the command line"**.
8. Open your computer's terminal (or Command Prompt / PowerShell), make sure you are in `c:\Users\USER\Desktop\AiXpertLabs\SaleAi`, and paste the commands GitHub gives you. They will look exactly like this:

   ```bash
   git branch -M main
   git remote add origin https://github.com/YourUsername/SaleAi-App.git
   git push -u origin main
   ```

Once you hit enter on that last command, all your code will be safely in the cloud on GitHub! 

Now you can go to [Render.com](https://render.com/), create your Web Service, connect your GitHub account, select this repository, and follow the rest of the `DEPLOYMENT-FREE.md` guide.
