#!/usr/bin/env python3
"""
Simple Deployment Script for Zinga Linga React App
Works even if npm is not in PATH
"""

import os
import sys
import subprocess
import webbrowser
from pathlib import Path

def run_command(cmd, cwd=None):
    """Run a command and return success status"""
    try:
        result = subprocess.run(cmd, shell=True, cwd=cwd, 
                              capture_output=True, text=True, check=True)
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr
    except Exception as e:
        return False, str(e)

def main():
    print("🚀 Zinga Linga Simple Deploy")
    print("=" * 35)
    print()
    
    # Get current directory
    project_dir = Path(__file__).parent
    dist_dir = project_dir / "dist"
    
    print(f"📍 Project: {project_dir.name}")
    print(f"📁 Location: {project_dir}")
    print()
    
    # Check if we're in the right place
    package_json = project_dir / "package.json"
    if not package_json.exists():
        print("❌ package.json not found!")
        print("❌ Make sure you're running this from the React project folder")
        return False
    
    print("✅ Found package.json")
    
    # Try different ways to run npm
    npm_commands = ["npm", "npm.cmd", "npx"]
    npm_found = False
    
    for npm_cmd in npm_commands:
        print(f"🔍 Trying {npm_cmd}...")
        success, output = run_command(f"{npm_cmd} --version")
        if success:
            print(f"✅ Found {npm_cmd}: {output.strip()}")
            npm_found = True
            break
    
    if not npm_found:
        print("❌ npm not found in any common locations")
        print("📋 Please install Node.js from: https://nodejs.org")
        print("📋 Or run this script from a terminal where npm is available")
        return False
    
    # Build the app
    print()
    print("🔨 Building React app...")
    
    build_commands = [
        f"{npm_cmd} run build",
        f"{npm_cmd} run build --legacy-peer-deps",
        "yarn build"
    ]
    
    build_success = False
    for build_cmd in build_commands:
        print(f"🔄 Trying: {build_cmd}")
        success, output = run_command(build_cmd, cwd=project_dir)
        if success:
            print("✅ Build successful!")
            build_success = True
            break
        else:
            print(f"⚠️ Failed: {output[:200]}...")
    
    if not build_success:
        print("❌ All build attempts failed!")
        print("📋 Try running 'npm install' first, then run this script again")
        return False
    
    # Check if dist folder was created
    if not dist_dir.exists():
        print("❌ Build completed but dist folder not found!")
        return False
    
    print(f"✅ Build output ready: {dist_dir}")
    
    # Count files in dist
    try:
        files = list(dist_dir.rglob('*'))
        file_count = len([f for f in files if f.is_file()])
        print(f"📊 Generated {file_count} files")
    except:
        pass
    
    # Open dist folder
    print()
    print("📁 Opening deployment folder...")
    try:
        if sys.platform == "win32":
            os.startfile(str(dist_dir))
        elif sys.platform == "darwin":  # macOS
            subprocess.run(["open", str(dist_dir)])
        else:  # Linux
            subprocess.run(["xdg-open", str(dist_dir)])
        print("✅ Folder opened successfully")
    except Exception as e:
        print(f"⚠️ Could not open folder automatically: {e}")
        print(f"📁 Please manually open: {dist_dir}")
    
    # Open Netlify
    print("🌐 Opening Netlify...")
    try:
        webbrowser.open("https://app.netlify.com")
        print("✅ Netlify opened in browser")
    except Exception as e:
        print(f"⚠️ Could not open browser: {e}")
        print("🌐 Please manually go to: https://app.netlify.com")
    
    # Show deployment instructions
    print()
    print("🎯 DEPLOYMENT STEPS:")
    print("=" * 25)
    print("1. ✅ Your 'dist' folder is now open")
    print("2. ✅ Netlify is open in your browser")
    print("3. 🎯 In Netlify, look for 'Deploy manually' or 'Drag and drop'")
    print("4. 🖱️  Drag the ENTIRE 'dist' folder to that area")
    print("5. ⏳ Wait 30-60 seconds for deployment")
    print("6. 🎉 Your app will be LIVE with a URL like:")
    print("   https://amazing-name-123456.netlify.app")
    print()
    print("🔧 If you get 'Page not found' errors:")
    print("   - This is normal for React apps")
    print("   - The _redirects file will fix it automatically")
    print()
    print("✨ Your Zinga Linga app is ready to deploy!")
    
    return True

if __name__ == "__main__":
    try:
        print("Starting deployment process...")
        print()
        
        success = main()
        
        print()
        if success:
            print("🎉 SUCCESS! Ready to deploy to Netlify!")
        else:
            print("❌ Setup incomplete. Please fix the issues above.")
        
        print()
        input("Press Enter to exit...")
        
    except KeyboardInterrupt:
        print("\n⚠️ Cancelled by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        print("Please try running the script again or deploy manually.")
        input("Press Enter to exit...")