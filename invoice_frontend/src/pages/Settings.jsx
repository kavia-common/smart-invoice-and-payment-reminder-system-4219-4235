import { useEffect, useMemo, useState } from 'react';
import { SettingsApi } from '../api/settingsApi';

// Helper to show lightweight toast via alert fallback
function toast(msg, isError = false) {
  // In a minimal template, use alert; could be replaced by a better toast system
  if (isError) {
    window.alert(msg);
  } else {
    window.alert(msg);
  }
}

export default function Settings() {
  const [settings, setSettings] = useState({
    channels: { EMAIL: false, SMS: false, WHATSAPP: false },
    providers: { EMAIL: { available: true }, SMS: { available: true }, WHATSAPP: { available: true } },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [testDestination, setTestDestination] = useState({ EMAIL: '', SMS: '', WHATSAPP: '' });
  const [testing, setTesting] = useState({ EMAIL: false, SMS: false, WHATSAPP: false });

  // Load combined settings: try provider-specific endpoint first, fallback to generic
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      // Prefer provider-specific settings if available
      let providerResp = null;
      try {
        providerResp = await SettingsApi.getProviderSettings();
      } catch {
        // ignore if endpoint missing; will fallback
      }

      if (providerResp?.data) {
        const data = providerResp.data || {};
        // Expect shape: { channels: {EMAIL: bool,...}, providers: {EMAIL:{available:bool},...}}
        setSettings({
          channels: data.channels || { EMAIL: false, SMS: false, WHATSAPP: false },
          providers: data.providers || {
            EMAIL: { available: true },
            SMS: { available: true },
            WHATSAPP: { available: true },
          },
        });
      } else {
        const { data } = await SettingsApi.get();
        setSettings({
          channels: data?.channels || { EMAIL: false, SMS: false, WHATSAPP: false },
          providers:
            data?.providers || {
              EMAIL: { available: true },
              SMS: { available: true },
              WHATSAPP: { available: true },
            },
        });
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const availableChannels = useMemo(() => {
    const prov = settings.providers || {};
    return ['EMAIL', 'SMS', 'WHATSAPP'].filter((k) => prov?.[k]?.available !== false);
  }, [settings.providers]);

  const toggle = async (channel) => {
    const enabled = !(settings?.channels?.[channel]);
    // optimistic update
    setSettings((s) => ({ ...s, channels: { ...(s.channels || {}), [channel]: enabled } }));
    try {
      await SettingsApi.toggleChannel(channel, enabled);
      toast(`Channel ${channel} ${enabled ? 'enabled' : 'disabled'}.`);
    } catch (e) {
      // revert
      setSettings((s) => ({ ...s, channels: { ...(s.channels || {}), [channel]: !enabled } }));
      toast(e?.response?.data?.message || 'Failed to update channel toggle.', true);
    }
  };

  const onSave = async () => {
    setSaving(true);
    try {
      // Try provider-specific update first, fallback to generic update
      try {
        await SettingsApi.updateProviderSettings({
          channels: settings.channels,
        });
      } catch {
        await SettingsApi.update({ channels: settings.channels });
      }
      toast('Settings saved.');
    } catch (e) {
      toast(e?.response?.data?.message || 'Save failed.', true);
    } finally {
      setSaving(false);
    }
  };

  const onTestSend = async (channel) => {
    const to = (testDestination?.[channel] || '').trim();
    if (!to) {
      toast(`Please enter a destination for ${channel} test.`, true);
      return;
    }
    setTesting((s) => ({ ...s, [channel]: true }));
    try {
      await SettingsApi.testSend(channel, to);
      toast(`Test ${channel} sent to ${to}.`);
    } catch (e) {
      toast(e?.response?.data?.message || `Test ${channel} failed.`, true);
    } finally {
      setTesting((s) => ({ ...s, [channel]: false }));
    }
  };

  return (
    <div>
      <h2>Settings</h2>
      {loading && <div>Loading settings...</div>}
      {error && <div className="text-muted" style={{ color: 'var(--error)', marginTop: 8 }}>{error}</div>}

      {/* Channel toggles */}
      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <div className="card-header">Messaging Providers</div>
        <div className="card-body">
          <div className="text-muted" style={{ marginBottom: 8 }}>
            Enable channels available per environment (email, SMS, WhatsApp).
          </div>
          {availableChannels.map((ch) => (
            <div key={ch} className="helper-row" style={{ gap: 8, alignItems: 'center', marginBottom: 8, justifyContent: 'space-between' }}>
              <label className="helper-row" style={{ gap: 8, alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={!!settings?.channels?.[ch]}
                  onChange={() => toggle(ch)}
                />
                <span>{ch}</span>
              </label>
              <div className="helper-row" style={{ gap: 8 }}>
                <input
                  className="input"
                  style={{ minWidth: 220 }}
                  type={ch === 'EMAIL' ? 'email' : 'text'}
                  placeholder={ch === 'EMAIL' ? 'test@example.com' : ch === 'SMS' ? '+15551234567' : 'WhatsApp number'}
                  value={testDestination[ch] || ''}
                  onChange={(e) =>
                    setTestDestination((s) => ({ ...s, [ch]: e.target.value }))
                  }
                />
                <button
                  className="btn secondary"
                  onClick={() => onTestSend(ch)}
                  disabled={testing[ch]}
                >
                  {testing[ch] ? 'Sending...' : `Test ${ch}`}
                </button>
              </div>
            </div>
          ))}
          {availableChannels.length === 0 && (
            <div className="text-muted">No messaging providers are available in this environment.</div>
          )}
        </div>
      </div>

      {/* Save */}
      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <div className="card-header">Save</div>
        <div className="card-body">
          <button className="btn" onClick={onSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
