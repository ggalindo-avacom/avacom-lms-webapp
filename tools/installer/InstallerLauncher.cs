using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

internal static class InstallerLauncher
{
    [STAThread]
    private static int Main()
    {
        string projectDirectory = AppDomain.CurrentDomain.BaseDirectory;
        string installerPath = Path.Combine(projectDirectory, "AVACOM-LMS-Setup.bat");

        if (!File.Exists(installerPath))
        {
            MessageBox.Show(
                "AVACOM-LMS-Setup.bat was not found next to the installer executable.\n\n" +
                "Extract and copy the complete project folder before running setup.",
                "AVACOM LMS Installer",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error
            );
            return 1;
        }

        try
        {
            ProcessStartInfo startInfo = new ProcessStartInfo
            {
                FileName = installerPath,
                WorkingDirectory = projectDirectory,
                UseShellExecute = true
            };

            Process.Start(startInfo);
            return 0;
        }
        catch (Exception exception)
        {
            MessageBox.Show(
                "The installer could not be started.\n\n" + exception.Message,
                "AVACOM LMS Installer",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error
            );
            return 1;
        }
    }
}
