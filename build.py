import os
import shutil
import subprocess

def build_app():
    try:
        # 1. Build Frontend
        print("Building Frontend...")
        os.chdir("frontend")
        # ใช้ path เต็มของ npm
        npm_path = "npm.cmd" if os.name == 'nt' else 'npm'  # สำหรับ Windows ต้องใช้ .cmd
        subprocess.run([npm_path, "run", "build"], check=True, shell=True)
        
        # 2. Create static folder in backend if it doesn't exist
        backend_static = "../backend/static"
        if not os.path.exists(backend_static):
            os.makedirs(backend_static)
            
        # 3. Copy frontend build to backend static folder
        print("Copying frontend build to backend...")
        # Copy all files from dist to static
        for item in os.listdir("dist"):
            source = os.path.join("dist", item)
            destination = os.path.join(backend_static, item)
            if os.path.isdir(source):
                if os.path.exists(destination):
                    shutil.rmtree(destination)
                shutil.copytree(source, destination)
            else:
                shutil.copy2(source, destination)
        
        # 4. Go to backend directory and build executable
        print("Building executable...")
        os.chdir("../backend")
        
        # Create spec file for PyInstaller
        spec_content = """
# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['app/main.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('static', 'static'),
        ('app/models', 'models'),
        ('app/routes', 'routes'),
        ('app/services', 'services'),
    ],
    hiddenimports=['uvicorn.logging', 'uvicorn.protocols', 'uvicorn.lifespan', 'uvicorn.protocols.http'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='ThaiDictBuddy',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon='site.ico',
)
        """
        
        with open('ThaiDictBuddy.spec', 'w') as f:
            f.write(spec_content.strip())
        
        # Build using the spec file
        subprocess.run(["pyinstaller", "ThaiDictBuddy.spec"], check=True)
        
        print("\nBuild complete! Executable is in the 'dist' folder")
        print("You can find it at: " + os.path.abspath("dist/ThaiDictBuddy.exe"))
        
    except subprocess.CalledProcessError as e:
        print(f"Error during build process: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    build_app()