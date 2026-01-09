import type { SavedSignature } from '@app/hooks/tools/sign/useSavedSignatures';

export type StorageType = 'localStorage';

class SignatureStorageService {
  private readonly STORAGE_KEY = 'stirling:saved-signatures:v1';

  async getStorageType(): Promise<StorageType> {
    return 'localStorage';
  }

  /**
   * Load all signatures
   */
  async loadSignatures(): Promise<SavedSignature[]> {
    return this._loadFromLocalStorage();
  }

  /**
   * Save a signature
   */
  async saveSignature(signature: SavedSignature): Promise<void> {
    signature.scope = 'localStorage';
    this._saveToLocalStorage(signature);
  }

  /**
   * Delete a signature
   */
  async deleteSignature(id: string): Promise<void> {
    this._deleteFromLocalStorage(id);
  }

  /**
   * Update signature label
   */
  async updateSignatureLabel(id: string, label: string): Promise<void> {
    this._updateLabelInLocalStorage(id, label);
  }

  // LocalStorage methods
  private _loadFromLocalStorage(): SavedSignature[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      const signatures = JSON.parse(raw);
      // Ensure all localStorage signatures have the correct scope
      return signatures.map((sig: SavedSignature) => ({
        ...sig,
        scope: 'localStorage' as const,
      }));
    } catch {
      return [];
    }
  }

  private _saveToLocalStorage(signature: SavedSignature): void {
    const signatures = this._loadFromLocalStorage();
    const index = signatures.findIndex(s => s.id === signature.id);

    if (index >= 0) {
      signatures[index] = signature;
    } else {
      signatures.unshift(signature);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(signatures));
  }

  private _deleteFromLocalStorage(id: string): void {
    const signatures = this._loadFromLocalStorage();
    const filtered = signatures.filter(s => s.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  private _updateLabelInLocalStorage(id: string, label: string): void {
    const signatures = this._loadFromLocalStorage();
    const signature = signatures.find(s => s.id === id);
    if (signature) {
      signature.label = label;
      signature.updatedAt = Date.now();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(signatures));
    }
  }

  /**
   * Migrate signatures from localStorage to backend
   */
  async migrateToBackend(): Promise<{ migrated: number; failed: number }> {
    const capabilities = await this.detectCapabilities();

    if (!capabilities.supportsBackend) {
      return { migrated: 0, failed: 0 };
    }

    const localSignatures = this._loadFromLocalStorage();
    if (localSignatures.length === 0) {
      return { migrated: 0, failed: 0 };
    }

    let migrated = 0;
    let failed = 0;

    for (const signature of localSignatures) {
      try {
        await this._saveToBackend(signature);
        migrated++;
      } catch (error) {
        console.error(`[SignatureStorage] Failed to migrate signature ${signature.id}:`, error);
        failed++;
      }
    }

    // Clear localStorage after successful migration
    if (migrated > 0 && failed === 0) {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log(`[SignatureStorage] Successfully migrated ${migrated} signatures to backend`);
    }

    return { migrated, failed };
  }
}

export const signatureStorageService = new SignatureStorageService();
