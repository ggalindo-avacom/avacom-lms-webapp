# AVACOM LMS — Windows 11 installation

This package installs and runs the current AVACOM LMS proof of concept:

- Django REST Framework backend on port `8000`.
- React/Vite frontend on port `5173`.

The glossary URL `/avacom-lms/main/glossary/index.php?...` is treated as the legacy/reference route for the glossary use case. This repository does not contain or install PHP or Chamilo; the proposed glossary replacement is documented in [Glossary prototype notes](docs/GLOSSARY_PROTOTYPE_NOTES.md).

## Supported environment

- Windows 11 64-bit with current security updates.
- Python 3.12.x or newer. Python 3.12 is the recommended baseline.
- Node.js 22 LTS recommended; Node.js 20 or newer is accepted.
- npm, included with the standard Node.js installer.
- Internet access during installation for Python and npm dependencies.
- Permission to approve a Windows UAC prompt when firewall rules are configured.

Do not install Python or Node.js from an unofficial mirror.

### Install Python

1. Download the Windows 64-bit installer from <https://www.python.org/downloads/windows/>.
2. Run the installer.
3. Enable **Add python.exe to PATH**.
4. Keep `pip`, the Python launcher, and the standard library selected.
5. Open a new Command Prompt and verify:

```cmd
python --version
```

The reported version must be Python 3.12 or newer.

### Install Node.js

1. Download Node.js 22 LTS for Windows 64-bit from <https://nodejs.org/>.
2. Run the installer with npm enabled.
3. Open a new Command Prompt and verify:

```cmd
node --version
npm --version
```

Node.js must be version 20 or newer.

## Run the installer

1. Copy or extract the complete project folder to a local writable directory. Avoid running it directly from a ZIP file, OneDrive placeholder, or network share.
2. Double-click `AVACOM-LMS-Setup.exe`. The executable must remain next to `AVACOM-LMS-Setup.bat` and the `backend` and `frontend` folders.
3. Keep the console open until it reports `INSTALLATION COMPLETED`.
4. Double-click `networkrules.bat` once and approve the administrator/UAC prompt. It opens inbound TCP ports `8000` and `5173`.
5. Double-click `run.bat`.
6. Register the available Wi-Fi networks through the API described below.

The launcher opens two console windows:

- Django: `http://localhost:8000`
- Vite: `http://localhost:5173`

For another device on the same LAN, replace `localhost` with the Windows host's IPv4 address, for example:

```text
http://192.168.0.20:5173
```

## What the installer does

The installer:

1. validates Python 3.12+, `venv`, Node.js 20+, and npm;
2. creates `backend\venv`;
3. installs `backend\requirements.txt`;
4. preserves an existing `backend\.env`, or creates one from `.env.example`;
5. applies Django database migrations;
6. runs Django's system check;
7. installs frontend dependencies using `npm ci` when a lockfile is available;
8. creates a production build to validate the frontend.

The installer is safe to run again. Existing environment settings and registered
Wi-Fi networks are preserved.

## Register Wi-Fi networks

Wi-Fi credentials are stored in the database and are no longer read from `.env`.
For the current proof of concept, this endpoint does not require authentication:

```http
POST /api/network/wifi-networks/
Content-Type: application/json
```

Secured network:

```json
{
  "name": "Makers",
  "wifipassword": "network-password",
  "type": "WPA"
}
```

Open network:

```json
{
  "name": "Makers Guest",
  "wifipassword": "",
  "type": "nopass"
}
```

Supported input types are `WPA`, `WPA2`, `WPA3`, `WEP`, `nopass`, and `none`.
WPA variants are stored using the canonical QR type `WPA`.

The same endpoint supports `GET` to list registered networks.
The public `GET /api/network/ip-address/` detects the host's current SSID,
selects the matching database record, and returns the Wi-Fi QR payload to the
frontend.

> Security note: authentication and role-based authorization must be restored
> before this proof of concept is deployed outside a controlled test network.

### Windows SmartScreen

`AVACOM-LMS-Setup.exe` is an internal, unsigned launcher. Windows may display a SmartScreen warning when the package was downloaded:

1. Confirm the ZIP/package came from AVACOM.
2. Select **More info**.
3. Confirm the displayed filename is `AVACOM-LMS-Setup.exe`.
4. Select **Run anyway**.

If organizational policy blocks unsigned executables, run `AVACOM-LMS-Setup.bat` directly or have the IT team code-sign the executable before distribution.

## Troubleshooting

### Python or npm is not found

Close all terminals after installing Python or Node.js and open a new Command Prompt. If the error remains, reinstall the missing runtime and ensure its PATH option is enabled.

### Another device cannot connect

- Confirm both devices are on the same LAN.
- Run `networkrules.bat` and approve UAC.
- Confirm the Wi-Fi router does not enable client/AP isolation.
- Confirm Django and Vite remain open in their respective console windows.

### Installation fails while downloading packages

Check Internet access, corporate proxy rules, TLS inspection, and access to PyPI and the npm registry. Run the installer again after connectivity is restored.

### Stop the application

Close the Django and Vite console windows opened by `run.bat`.
