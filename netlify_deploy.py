#!/usr/bin/env python3
"""
Advanced Netlify Deployment Script
Automates deployment using Netlify CLI or manual methods
"""

import os
import sys
import subprocess
import json
import webbrowser
from pathlib import Path
import time

class NetlifyDeployer:
    def __init__(self):
        self.project_dir = Path(__file__).parent
        self.dist_dir = self.project_dir / "dist"
        
    def check_netlify_cli(self):
        """Check if Netlify CLI is installed"""
        try:
            result = subprocess.run(['netlify', '--version'], 
                                  capture_output=True, text=True, check=True)
            print(f"✅ Netlify CLI found: {result.stdout.strip()}")
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            return False
            
    def install_netlify_cli(self):
        """Install Netlify CLI"""
        print("📦 Installing Netlify CLI...")
        try:
            subprocess.run(['npm', 'install', '-g', 'netlify-cli'], check=True)
            print("✅ Netlify CLI installed successfully!")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install Netlify CLI")
            return False
            
    def build_app(self):
        """Build the React app"""
        print("🔨 Building React app...")
        try:
            subprocess.run(['npm', 'run', 'build'], 
                          cwd=self.project_dir, check=True)
            print("✅ Build completed!")
            return True
        except subprocess.CalledProcessError:
            print("❌ Build failed!")
            return False
            
    def netlify_login(self):
        """Login to Netlify"""
        print("🔐 Logging into Netlify...")
        try:
            subprocess.run(['netlify', 'login'], check=True)
            print("✅ Logged into Netlify!")
            return True
        except subprocess.CalledProcessError:
            print("❌ Netlify login failed!")
            return False
            
    def netlify_init(self):
        """Initialize Netlify site"""
        print("🚀 Initializing Netlify site...")
        try:
            subprocess.run(['netlify', 'init'], cwd=self.project_dir, check=True)
            print("✅ Netlify site initialized!")
            return True
        except subprocess.CalledProcessError:
            print("⚠️ Site might already be initialized")
            return True
            
    def netlify_deploy(self, production=False):
        """Deploy to Netlify"""
        deploy_type = "production" if production else "preview"
        print(f"🚀 Deploying to Netlify ({deploy_type})...")
        
        try:
            cmd = ['netlify', 'deploy', '--dir=dist']
            if production:
                cmd.append('--prod')
                
            result = subprocess.run(cmd, cwd=self.project_dir, 
                                  capture_output=True, text=True, check=True)
            
            print("✅ Deployment successful!")
            print(result.stdout)
            
            # Extract URL from output
            lines = result.stdout.split('\n')
            for line in lines:
                if 'Website URL:' in line or 'Live URL:' in line:
                    url = line.split(':', 1)[1].strip()
                    print(f"🌐 Your app is live at: {url}")
                    
                    # Open in browser
                    try:
                        webbrowser.open(url)
                        print("✅ Opened in browser")
                    except:
                        pass
                    break
                    
            return True
            
        except subprocess.CalledProcessError as e:
            print("❌ Deployment failed!")
            print(e.stderr)
            return False
            
    def manual_deployment_guide(self):
        """Show manual deployment guide"""
        print()
        print("📋 MANUAL DEPLOYMENT GUIDE")
        print("=" * 40)
        print()
        print("Since automatic deployment isn't available,")
        print("here's how to deploy manually:")
        print()
        print("1. 📁 Open the 'dist' folder (opening now...)")
        print("2. 🌐 Go to https://app.netlify.com (opening now...)")
        print("3. 🎯 Drag the entire 'dist' folder to Netlify")
        print("4. ⏳ Wait for deployment to complete")
        print("5. 🎉 Your app will be live!")
        print()
        
        # Open dist folder
        try:
            if sys.platform == "win32":
                os.startfile(self.dist_dir)
            elif sys.platform == "darwin":
                subprocess.run(["open", self.dist_dir])
            else:
                subprocess.run(["xdg-open", self.dist_dir])
            print("✅ Dist folder opened")
        except:
            print(f"📁 Please manually open: {self.dist_dir}")
            
        # Open Netlify
        try:
            webbrowser.open("https://app.netlify.com")
            print("✅ Netlify opened in browser")
        except:
            print("🌐 Please manually go to: https://app.netlify.com")
            
    def run(self):
        """Run the deployment process"""
        print("🚀 NETLIFY DEPLOYMENT SCRIPT")
        print("=" * 40)
        print()
        
        # Build the app first
        if not self.build_app():
            return False
            
        # Check if Netlify CLI is available
        if not self.check_netlify_cli():
            print("⚠️ Netlify CLI not found")
            
            # Ask user if they want to install it
            response = input("Would you like to install Netlify CLI? (y/n): ").lower()
            if response == 'y':
                if self.install_netlify_cli():
                    print("✅ Netlify CLI installed!")
                else:
                    print("❌ Installation failed, using manual method")
                    self.manual_deployment_guide()
                    return True
            else:
                print("📋 Using manual deployment method")
                self.manual_deployment_guide()
                return True
                
        # CLI is available, proceed with automatic deployment
        print("🎯 Using Netlify CLI for deployment")
        
        # Login to Netlify
        if not self.netlify_login():
            print("❌ Login failed, using manual method")
            self.manual_deployment_guide()
            return True
            
        # Initialize site (if needed)
        self.netlify_init()
        
        # Ask for deployment type
        print()
        print("Choose deployment type:")
        print("1. Preview deployment (for testing)")
        print("2. Production deployment (live site)")
        
        choice = input("Enter choice (1 or 2): ").strip()
        
        if choice == "2":
            # Production deployment
            if self.netlify_deploy(production=True):
                print("🎉 Production deployment successful!")
            else:
                print("❌ Production deployment failed")
                self.manual_deployment_guide()
        else:
            # Preview deployment
            if self.netlify_deploy(production=False):
                print("🎉 Preview deployment successful!")
                
                # Ask if they want to deploy to production
                response = input("\nDeploy to production? (y/n): ").lower()
                if response == 'y':
                    self.netlify_deploy(production=True)
            else:
                print("❌ Preview deployment failed")
                self.manual_deployment_guide()
                
        return True

def main():
    deployer = NetlifyDeployer()
    
    try:
        deployer.run()
        print("\n✅ Deployment process completed!")
        input("Press Enter to exit...")
        
    except KeyboardInterrupt:
        print("\n⚠️ Deployment cancelled")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        input("Press Enter to exit...")

if __name__ == "__main__":
    main()