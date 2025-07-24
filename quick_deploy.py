#!/usr/bin/env python3
"""
Quick Deployment Script for Zinga Linga React App
Simple script to build and prepare for Netlify deployment
"""

import os
import subprocess
import webbrowser
import sys
from pathlib import Path

def main():
    print("🚀 Zinga Linga Quick Deploy")
    print("=" * 30)
    
    # Get current directory
    project_dir = Path(__file__).parent
    dist_dir = project_dir / "dist"
    
    print("📍 Project directory:", project_dir)
    print()
    
    # Step 1: Build the app
    print("🔨 Building React app...")
    try:
        result = subprocess.run(['npm', 'run', 'build'], 
                              cwd=project_dir, 
                              check=True,
                              capture_output=True,
                              text=True)
        print("✅ Build successful!")
    except subprocess.CalledProcessError as e:
        print("❌ Build failed!")
        print("Error:", e.stderr)
        return False
    except FileNotFoundError:
        print("❌ npm not found! Please install Node.js and npm first.")
        return False
    
    # Step 2: Check if dist folder exists
    if not dist_dir.exists():
        print("❌ Dist folder not found after build!")
        return False
    
    print(f"✅ Dist folder ready: {dist_dir}")
    
    # Step 3: Open dist folder
    print("📁 Opening dist folder...")
    try:
        if sys.platform == "win32":
            os.startfile(dist_dir)
        elif sys.platform == "darwin":  # macOS
            subprocess.run(["open", dist_dir])
        else:  # Linux
            subprocess.run(["xdg-open", dist_dir])
        print("✅ Dist folder opened")
    except Exception as e:
        print(f"⚠️ Could not open folder: {e}")
    
    # Step 4: Open Netlify
    print("🌐 Opening Netlify...")
    try:
        webbrowser.open("https://app.netlify.com")
        print("✅ Netlify opened in browser")
    except Exception as e:
        print(f"⚠️ Could not open browser: {e}")
    
    # Step 5: Show instructions
    print()
    print("🎯 DEPLOYMENT INSTRUCTIONS:")
    print("=" * 30)
    print("1. ✅ Your dist folder is now open")
    print("2. ✅ Netlify is open in your browser")
    print("3. 🎯 Drag the ENTIRE 'dist' folder to Netlify")
    print("4. ⏳ Wait 30 seconds")
    print("5. 🎉 Your app will be LIVE!")
    print()
    print("🔗 Netlify URL: https://app.netlify.com")
    print()
    print("✨ That's it! Your Zinga Linga app is ready to deploy!")
    
    return True

if __name__ == "__main__":
    try:
        success = main()
        if not success:
            input("\nPress Enter to exit...")
            sys.exit(1)
        else:
            input("\nPress Enter to exit...")
    except KeyboardInterrupt:
        print("\n⚠️ Cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        input("Press Enter to exit...")