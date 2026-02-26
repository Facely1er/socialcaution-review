/**
 * Encryption Setup Component
 * Allows premium users to set up, change, or disable zero-knowledge encryption for data export
 */

import { useState, useEffect } from 'react';
import { Lock, Key, Eye, EyeOff, AlertCircle, CheckCircle, Info, Shield } from 'lucide-react';
import encryptionService from '../../services/encryptionService';
import dataSyncService from '../../services/dataSyncService';
import hybridStorage from '../../services/hybridStorageService';
import { shouldUseSupabase } from '../../lib/supabase';

interface EncryptionSetupProps {
  className?: string;
}

const EncryptionSetup = ({ className = '' }: EncryptionSetupProps) => {
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [showConfirmPassphrase, setShowConfirmPassphrase] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [currentPassphrase, setCurrentPassphrase] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    setIsEncryptionEnabled(encryptionService.isEncryptionEnabled());
    setIsPremium(shouldUseSupabase());
  }, []);

  const handleEnableEncryption = async () => {
    setError(null);
    setSuccess(null);

    // Validation
    if (!passphrase || passphrase.length < 8) {
      setError('Passphrase must be at least 8 characters long');
      return;
    }

    if (passphrase !== confirmPassphrase) {
      setError('Passphrases do not match');
      return;
    }

    setLoading(true);

    try {
      // Initialize encryption with passphrase
      await encryptionService.initializeEncryption(passphrase);

      // Set passphrase in sync services
      dataSyncService.setEncryptionPassphrase(passphrase);
      hybridStorage.setEncryptionPassphrase(passphrase);

      setIsEncryptionEnabled(true);
      setShowSetup(false);
      setPassphrase('');
      setConfirmPassphrase('');
      setSuccess('Encryption enabled successfully! Your data will now be encrypted before export.');

      // Sync existing data to cloud with encryption
      try {
        await dataSyncService.syncToCloud();
      } catch (syncError) {
        console.error('Error syncing encrypted data:', syncError);
        // Don't fail the setup if sync fails - data is still encrypted locally
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enable encryption');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableEncryption = async () => {
    if (!window.confirm('Are you sure you want to disable encryption? Your data will be synced unencrypted to the cloud.')) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Clear encryption settings
      encryptionService.clearKeyParams();
      dataSyncService.setEncryptionPassphrase(null);
      hybridStorage.setEncryptionPassphrase(null);

      setIsEncryptionEnabled(false);
      setSuccess('Encryption disabled. Your data will be exported unencrypted.');

      // Re-sync data without encryption
      try {
        await dataSyncService.syncToCloud();
      } catch (syncError) {
        console.error('Error syncing unencrypted data:', syncError);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disable encryption');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassphrase = async () => {
    setError(null);
    setSuccess(null);

    // Verify current passphrase
    if (!currentPassphrase) {
      setError('Please enter your current passphrase');
      return;
    }

    const isValid = await encryptionService.verifyPassphrase(currentPassphrase);
    if (!isValid) {
      setError('Current passphrase is incorrect');
      return;
    }

    // Validate new passphrase
    if (!passphrase || passphrase.length < 8) {
      setError('New passphrase must be at least 8 characters long');
      return;
    }

    if (passphrase !== confirmPassphrase) {
      setError('New passphrases do not match');
      return;
    }

    setLoading(true);

    try {
      // Re-initialize with new passphrase
      await encryptionService.initializeEncryption(passphrase);

      // Update passphrase in sync services
      dataSyncService.setEncryptionPassphrase(passphrase);
      hybridStorage.setEncryptionPassphrase(passphrase);

      setCurrentPassphrase('');
      setPassphrase('');
      setConfirmPassphrase('');
      setShowSetup(false);
      setSuccess('Passphrase changed successfully! Re-syncing data with new encryption...');

      // Re-sync all data with new encryption
      try {
        await dataSyncService.syncToCloud();
      } catch (syncError) {
        console.error('Error re-syncing with new encryption:', syncError);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change passphrase');
    } finally {
      setLoading(false);
    }
  };

  const _handleUnlockSync = async () => {
    setError(null);

    if (!passphrase || passphrase.length < 8) {
      setError('Passphrase must be at least 8 characters long');
      return;
    }

    const isValid = await encryptionService.verifyPassphrase(passphrase);
    if (!isValid) {
      setError('Incorrect passphrase');
      return;
    }

    // Set passphrase in sync services
    dataSyncService.setEncryptionPassphrase(passphrase);
    hybridStorage.setEncryptionPassphrase(passphrase);

    setPassphrase('');
    setShowSetup(false);
    setSuccess('Encryption unlocked! You can now sync your data.');
  };

  if (!isPremium) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-6 h-6 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Encrypted Data Export
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Upgrade to Premium or Family Plan to enable encrypted data export for secure manual backup.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isEncryptionEnabled ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
            {isEncryptionEnabled ? (
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <Lock className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Encrypted Data Export
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isEncryptionEnabled
                ? 'Zero-knowledge encryption enabled'
                : 'Encrypt your data before export for secure manual backup'}
            </p>
          </div>
        </div>
        {!showSetup && (
          <button
            onClick={() => {
              setShowSetup(true);
              setError(null);
              setSuccess(null);
            }}
            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            {isEncryptionEnabled ? 'Change' : 'Enable'}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}

      {showSetup && (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Zero-Knowledge Encryption</p>
                <p className="text-xs">
                  Your data is encrypted using AES-256-GCM before export. 
                  Your passphrase is never transmitted and we cannot decrypt your data. 
                  If you forget your passphrase, your encrypted data cannot be recovered.
                </p>
              </div>
            </div>
          </div>

          {isEncryptionEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Passphrase
              </label>
              <div className="relative">
                <input
                  type={showPassphrase ? 'text' : 'password'}
                  value={currentPassphrase}
                  onChange={(e) => setCurrentPassphrase(e.target.value)}
                  placeholder="Enter current passphrase"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassphrase ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isEncryptionEnabled ? 'New Passphrase' : 'Passphrase'} (min. 8 characters)
            </label>
            <div className="relative">
              <input
                type={showPassphrase ? 'text' : 'password'}
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Enter passphrase"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassphrase(!showPassphrase)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassphrase ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Passphrase
            </label>
            <div className="relative">
              <input
                type={showConfirmPassphrase ? 'text' : 'password'}
                value={confirmPassphrase}
                onChange={(e) => setConfirmPassphrase(e.target.value)}
                placeholder="Confirm passphrase"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassphrase(!showConfirmPassphrase)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassphrase ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            {isEncryptionEnabled ? (
              <>
                <button
                  onClick={handleChangePassphrase}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Changing...' : 'Change Passphrase'}
                </button>
                <button
                  onClick={handleDisableEncryption}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Disable
                </button>
              </>
            ) : (
              <button
                onClick={handleEnableEncryption}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enabling...' : 'Enable Encryption'}
              </button>
            )}
            <button
              onClick={() => {
                setShowSetup(false);
                setError(null);
                setSuccess(null);
                setPassphrase('');
                setConfirmPassphrase('');
                setCurrentPassphrase('');
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!showSetup && isEncryptionEnabled && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <Key className="w-3 h-3 inline mr-1" />
            Your data is encrypted with AES-256-GCM. Encryption keys are derived from your passphrase and never stored or transmitted.
          </p>
        </div>
      )}
    </div>
  );
};

export default EncryptionSetup;

