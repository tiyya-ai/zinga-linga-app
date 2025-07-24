#!/usr/bin/env python3
"""
Zinga Linga React App Deployment Script
Automates the deployment process to Netlify
"""

import os
import sys
import subprocess
import shutil
import zipfile
import webbrowser
from pathlib import Path
import json
import time

class ZingaLingaDeployer:
    def __init__(self):
        self.project_dir = Path(__file__).parent
        self.dist_dir = self.project_dir / "dist"
        self.deploy_zip = self.project_dir / "zinga-linga-deploy.zip"
        
    def print_banner(self):
        """Print deployment banner"""
        print("=" * 60)
        print("🚀 ZINGA LINGA REACT APP DEPLOYMENT SCRIPT")
        print("=" * 60)
        print()
        
    def check_requirements(self):
        """Check if all requirements are met"""
        print("🔍 Checking requirements...")
        
        # Check if Node.js is installed
        try:
            result = subprocess.run(['node', '--version'], 
                                  capture_output=True, text=True, check=True)
            print(f"✅ Node.js: {result.stdout.strip()}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("❌ Node.js not found! Please install Node.js first.")
            return False
            
        # Check if npm is installed
        try:
            result = subprocess.run(['npm', '--version'], 
                                  capture_output=True, text=True, check=True)
            print(f"✅ npm: {result.stdout.strip()}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("❌ npm not found! Please install npm first.")
            return False
            
        # Check if package.json exists
        if not (self.project_dir / "package.json").exists():
            print("❌ package.json not found! Are you in the right directory?")
            return False
        print("✅ package.json found")
        
        print()
        return True
        
    def install_dependencies(self):
        """Install npm dependencies if needed"""
        if not (self.project_dir / "node_modules").exists():
            print("📦 Installing dependencies...")
            try:
                subprocess.run(['npm', 'install'], 
                             cwd=self.project_dir, check=True)
                print("✅ Dependencies installed successfully")
            except subprocess.CalledProcessError:
                print("❌ Failed to install dependencies")
                return False
        else:
            print("✅ Dependencies already installed")
        print()
        return True
        
    def build_app(self):
        """Build the React app"""
        print("🔨 Building React app...")
        
        try:
            # Remove old dist directory
            if self.dist_dir.exists():
                shutil.rmtree(self.dist_dir)
                
            # Build the app
            result = subprocess.run(['npm', 'run', 'build'], 
                                  cwd=self.project_dir, 
                                  capture_output=True, text=True, check=True)
            
            if self.dist_dir.exists():
                print("✅ Build completed successfully!")
                
                # Show build stats
                dist_files = list(self.dist_dir.rglob('*'))
                total_size = sum(f.stat().st_size for f in dist_files if f.is_file())
                print(f"📊 Build stats: {len(dist_files)} files, {total_size / 1024 / 1024:.2f} MB")
                
                return True
            else:
                print("❌ Build failed - dist directory not created")
                return False
                
        except subprocess.CalledProcessError as e:
            print(f"❌ Build failed: {e}")
            if e.stdout:
                print("STDOUT:", e.stdout)
            if e.stderr:
                print("STDERR:", e.stderr)
            return False
        
    def create_deployment_package(self):
        """Create a zip file for easy deployment"""
        print("📦 Creating deployment package...")
        
        try:
            # Remove old zip if exists
            if self.deploy_zip.exists():
                self.deploy_zip.unlink()
                
            # Create zip file
            with zipfile.ZipFile(self.deploy_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for file_path in self.dist_dir.rglob('*'):
                    if file_path.is_file():
                        # Add file to zip with relative path
                        arcname = file_path.relative_to(self.dist_dir)
                        zipf.write(file_path, arcname)
                        
            print(f"✅ Deployment package created: {self.deploy_zip.name}")
            print(f"📦 Package size: {self.deploy_zip.stat().st_size / 1024 / 1024:.2f} MB")
            return True
            
        except Exception as e:
            print(f"❌ Failed to create deployment package: {e}")
            return False
            
    def open_deployment_folder(self):
        """Open the dist folder for manual deployment"""
        print("📁 Opening deployment folder...")
        
        try:
            if sys.platform == "win32":
                os.startfile(self.dist_dir)
            elif sys.platform == "darwin":  # macOS
                subprocess.run(["open", self.dist_dir])
            else:  # Linux
                subprocess.run(["xdg-open", self.dist_dir])
            print("✅ Deployment folder opened")
            return True
        except Exception as e:
            print(f"❌ Failed to open folder: {e}")
            return False
            
    def show_deployment_instructions(self):
        """Show deployment instructions"""
        print()
        print("🌐 DEPLOYMENT INSTRUCTIONS")
        print("=" * 40)
        print()
        print("METHOD 1: Drag & Drop (Easiest)")
        print("1. Go to https://app.netlify.com")
        print("2. Drag the 'dist' folder (now open) to the deployment area")
        print("3. Wait 30 seconds - your app will be live!")
        print()
        print("METHOD 2: Zip Upload")
        print(f"1. Upload the file: {self.deploy_zip.name}")
        print("2. Extract it on Netlify or use zip upload feature")
        print()
        print("METHOD 3: Netlify CLI (Advanced)")
        print("1. Install: npm install -g netlify-cli")
        print("2. Run: netlify deploy --prod --dir=dist")
        print()
        
    def open_netlify(self):
        """Open Netlify in browser"""
        print("🌐 Opening Netlify...")
        try:
            webbrowser.open("https://app.netlify.com")
            print("✅ Netlify opened in browser")
        except Exception as e:
            print(f"❌ Failed to open browser: {e}")
            
    def deploy_with_netlify_cli(self):
        """Deploy using Netlify CLI if available"""
        print("🚀 Attempting deployment with Netlify CLI...")
        
        try:
            # Check if Netlify CLI is installed
            subprocess.run(['netlify', '--version'], 
                          capture_output=True, check=True)
            print("✅ Netlify CLI found")
            
            # Try to deploy
            print("🚀 Deploying to Netlify...")
            result = subprocess.run(['netlify', 'deploy', '--prod', '--dir=dist'], 
                                  cwd=self.project_dir, 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ Deployment successful!")
                print(result.stdout)
                return True
            else:
                print("⚠️ Netlify CLI deployment failed, use manual method")
                print(result.stderr)
                return False
                
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("⚠️ Netlify CLI not found, using manual deployment")
            return False
            
    def run_deployment(self):
        """Run the complete deployment process"""
        self.print_banner()
        
        # Check requirements
        if not self.check_requirements():
            return False
            
        # Install dependencies
        if not self.install_dependencies():
            return False
            
        # Build app
        if not self.build_app():
            return False
            
        # Create deployment package
        self.create_deployment_package()
        
        # Try Netlify CLI first
        if not self.deploy_with_netlify_cli():
            # Fall back to manual deployment
            self.open_deployment_folder()
            self.open_netlify()
            self.show_deployment_instructions()
            
        print()
        print("🎉 DEPLOYMENT PROCESS COMPLETE!")
        print("=" * 40)
        print("Your Zinga Linga React app is ready to go live!")
        print()
        
        return True

def main():
    """Main function"""
    deployer = ZingaLingaDeployer()
    
    try:
        success = deployer.run_deployment()
        if success:
            print("✅ All done! Your app should be live soon.")
        else:
            print("❌ Deployment process failed. Please check the errors above.")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n⚠️ Deployment cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()