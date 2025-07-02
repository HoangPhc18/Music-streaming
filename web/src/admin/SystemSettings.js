import React, { useState, useEffect } from 'react';
import './SystemSettings.css';
import './AdminStyles.css';

const SystemSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Music Streaming',
      siteDescription: 'A platform for music lovers',
      contactEmail: 'contact@musicstreaming.com',
      logoUrl: '',
      faviconUrl: ''
    },
    security: {
      registrationEnabled: true,
      requireEmailVerification: true,
      loginAttempts: 5,
      lockoutTime: 30,
      passwordMinLength: 8,
      passwordRequireSpecialChar: true,
      passwordRequireNumber: true,
      passwordRequireUppercase: true,
    },
    uploads: {
      maxFileSize: 10, // MB
      allowedFileTypes: '.mp3,.wav,.ogg,.flac',
      storageType: 'local', // local, s3, etc.
      s3Bucket: '',
      s3Region: '',
      s3AccessKey: '',
      s3SecretKey: ''
    },
    features: {
      enableComments: true,
      enableRatings: true,
      enableSharing: true,
      enablePlaylists: true,
      enableDownloads: false,
      enableArtistProfiles: true,
      enableUserProfiles: true
    },
    maintenance: {
      maintenanceMode: false,
      maintenanceMessage: 'We are currently performing maintenance. Please check back later.',
      allowAdminAccess: true
    }
  });

  useEffect(() => {
    // In a real app, this would be an API call to fetch settings
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, we would set the settings from the API response
        // For now, we'll just use the default settings
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load settings. Please try again later.');
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (section, field, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // In a real app, this would be an API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Settings saved successfully!');
      setSaving(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="system-settings">
      <h1>System Settings</h1>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* General Settings */}
        <div className="settings-section">
          <h2>General</h2>
          <div className="settings-grid">
            <div className="form-group">
              <label htmlFor="siteName">Site Name</label>
              <input
                type="text"
                id="siteName"
                value={settings.general.siteName}
                onChange={(e) => handleChange('general', 'siteName', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="siteDescription">Site Description</label>
              <textarea
                id="siteDescription"
                value={settings.general.siteDescription}
                onChange={(e) => handleChange('general', 'siteDescription', e.target.value)}
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contactEmail">Contact Email</label>
              <input
                type="email"
                id="contactEmail"
                value={settings.general.contactEmail}
                onChange={(e) => handleChange('general', 'contactEmail', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="logoUrl">Logo URL</label>
              <input
                type="text"
                id="logoUrl"
                value={settings.general.logoUrl}
                onChange={(e) => handleChange('general', 'logoUrl', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="faviconUrl">Favicon URL</label>
              <input
                type="text"
                id="faviconUrl"
                value={settings.general.faviconUrl}
                onChange={(e) => handleChange('general', 'faviconUrl', e.target.value)}
                placeholder="https://example.com/favicon.ico"
              />
            </div>
          </div>
        </div>
        
        {/* Security Settings */}
        <div className="settings-section">
          <h2>Security</h2>
          <div className="settings-grid">
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="registrationEnabled"
                checked={settings.security.registrationEnabled}
                onChange={(e) => handleChange('security', 'registrationEnabled', e.target.checked)}
              />
              <label htmlFor="registrationEnabled">Enable User Registration</label>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="requireEmailVerification"
                checked={settings.security.requireEmailVerification}
                onChange={(e) => handleChange('security', 'requireEmailVerification', e.target.checked)}
              />
              <label htmlFor="requireEmailVerification">Require Email Verification</label>
            </div>
            
            <div className="form-group">
              <label htmlFor="loginAttempts">Max Login Attempts</label>
              <input
                type="number"
                id="loginAttempts"
                value={settings.security.loginAttempts}
                onChange={(e) => handleChange('security', 'loginAttempts', parseInt(e.target.value))}
                min="1"
                max="10"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lockoutTime">Account Lockout Time (minutes)</label>
              <input
                type="number"
                id="lockoutTime"
                value={settings.security.lockoutTime}
                onChange={(e) => handleChange('security', 'lockoutTime', parseInt(e.target.value))}
                min="5"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="passwordMinLength">Password Minimum Length</label>
              <input
                type="number"
                id="passwordMinLength"
                value={settings.security.passwordMinLength}
                onChange={(e) => handleChange('security', 'passwordMinLength', parseInt(e.target.value))}
                min="6"
                max="20"
              />
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="passwordRequireSpecialChar"
                checked={settings.security.passwordRequireSpecialChar}
                onChange={(e) => handleChange('security', 'passwordRequireSpecialChar', e.target.checked)}
              />
              <label htmlFor="passwordRequireSpecialChar">Require Special Character</label>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="passwordRequireNumber"
                checked={settings.security.passwordRequireNumber}
                onChange={(e) => handleChange('security', 'passwordRequireNumber', e.target.checked)}
              />
              <label htmlFor="passwordRequireNumber">Require Number</label>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="passwordRequireUppercase"
                checked={settings.security.passwordRequireUppercase}
                onChange={(e) => handleChange('security', 'passwordRequireUppercase', e.target.checked)}
              />
              <label htmlFor="passwordRequireUppercase">Require Uppercase Letter</label>
            </div>
          </div>
        </div>
        
        {/* Upload Settings */}
        <div className="settings-section">
          <h2>Uploads</h2>
          <div className="settings-grid">
            <div className="form-group">
              <label htmlFor="maxFileSize">Max File Size (MB)</label>
              <input
                type="number"
                id="maxFileSize"
                value={settings.uploads.maxFileSize}
                onChange={(e) => handleChange('uploads', 'maxFileSize', parseInt(e.target.value))}
                min="1"
                max="100"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="allowedFileTypes">Allowed File Types</label>
              <input
                type="text"
                id="allowedFileTypes"
                value={settings.uploads.allowedFileTypes}
                onChange={(e) => handleChange('uploads', 'allowedFileTypes', e.target.value)}
                placeholder=".mp3,.wav,.ogg"
              />
              <small>Comma-separated list of file extensions</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="storageType">Storage Type</label>
              <select
                id="storageType"
                value={settings.uploads.storageType}
                onChange={(e) => handleChange('uploads', 'storageType', e.target.value)}
              >
                <option value="local">Local Storage</option>
                <option value="s3">Amazon S3</option>
                <option value="cloud">Cloud Storage</option>
              </select>
            </div>
            
            {settings.uploads.storageType === 's3' && (
              <>
                <div className="form-group">
                  <label htmlFor="s3Bucket">S3 Bucket Name</label>
                  <input
                    type="text"
                    id="s3Bucket"
                    value={settings.uploads.s3Bucket}
                    onChange={(e) => handleChange('uploads', 's3Bucket', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="s3Region">S3 Region</label>
                  <input
                    type="text"
                    id="s3Region"
                    value={settings.uploads.s3Region}
                    onChange={(e) => handleChange('uploads', 's3Region', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="s3AccessKey">S3 Access Key</label>
                  <input
                    type="password"
                    id="s3AccessKey"
                    value={settings.uploads.s3AccessKey}
                    onChange={(e) => handleChange('uploads', 's3AccessKey', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="s3SecretKey">S3 Secret Key</label>
                  <input
                    type="password"
                    id="s3SecretKey"
                    value={settings.uploads.s3SecretKey}
                    onChange={(e) => handleChange('uploads', 's3SecretKey', e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Feature Settings */}
        <div className="settings-section">
          <h2>Features</h2>
          <div className="settings-grid">
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="enableComments"
                checked={settings.features.enableComments}
                onChange={(e) => handleChange('features', 'enableComments', e.target.checked)}
              />
              <label htmlFor="enableComments">Enable Comments</label>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="enableRatings"
                checked={settings.features.enableRatings}
                onChange={(e) => handleChange('features', 'enableRatings', e.target.checked)}
              />
              <label htmlFor="enableRatings">Enable Ratings</label>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="enableSharing"
                checked={settings.features.enableSharing}
                onChange={(e) => handleChange('features', 'enableSharing', e.target.checked)}
              />
              <label htmlFor="enableSharing">Enable Social Sharing</label>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="enablePlaylists"
                checked={settings.features.enablePlaylists}
                onChange={(e) => handleChange('features', 'enablePlaylists', e.target.checked)}
              />
              <label htmlFor="enablePlaylists">Enable User Playlists</label>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="enableDownloads"
                checked={settings.features.enableDownloads}
                onChange={(e) => handleChange('features', 'enableDownloads', e.target.checked)}
              />
              <label htmlFor="enableDownloads">Enable Downloads</label>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="enableArtistProfiles"
                checked={settings.features.enableArtistProfiles}
                onChange={(e) => handleChange('features', 'enableArtistProfiles', e.target.checked)}
              />
              <label htmlFor="enableArtistProfiles">Enable Artist Profiles</label>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="enableUserProfiles"
                checked={settings.features.enableUserProfiles}
                onChange={(e) => handleChange('features', 'enableUserProfiles', e.target.checked)}
              />
              <label htmlFor="enableUserProfiles">Enable User Profiles</label>
            </div>
          </div>
        </div>
        
        {/* Maintenance Settings */}
        <div className="settings-section">
          <h2>Maintenance</h2>
          <div className="settings-grid">
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={settings.maintenance.maintenanceMode}
                onChange={(e) => handleChange('maintenance', 'maintenanceMode', e.target.checked)}
              />
              <label htmlFor="maintenanceMode">Enable Maintenance Mode</label>
            </div>
            
            <div className="form-group">
              <label htmlFor="maintenanceMessage">Maintenance Message</label>
              <textarea
                id="maintenanceMessage"
                value={settings.maintenance.maintenanceMessage}
                onChange={(e) => handleChange('maintenance', 'maintenanceMessage', e.target.value)}
                rows="3"
              />
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="allowAdminAccess"
                checked={settings.maintenance.allowAdminAccess}
                onChange={(e) => handleChange('maintenance', 'allowAdminAccess', e.target.checked)}
              />
              <label htmlFor="allowAdminAccess">Allow Admin Access During Maintenance</label>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="save-button" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;