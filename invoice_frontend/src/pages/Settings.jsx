import { useEffect, useState } from 'react';
import { SettingsApi } from '../api/settingsApi';

export default function Settings() {
  const [settings, setSettings] = useState({ channels: { EMAIL: true, SMS: false, WHATSAPP: false } });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [test, setTest] = useState({ email: '', phone: '' });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await SettingsApi.get();
      if (data) setSettings(data);
    } catch {
      // tolerate if backend not ready
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (channel) => {
    const enabled = !(settings?.channels?.[channel]);
    setSettings((s) => ({ ...s, channels: { ...(s.channels || {}), [channel]: enabled } }));
    try {
      await SettingsApi.toggleChannel(channel, enabled);
    } catch {
      window.alert('Failed to update channel toggle.');
    }
  };

  const onSave = async () => {
    setSaving(true);
    try {
      await SettingsApi.update(settings);
      window.alert('Settings saved.');
    } catch (e) {
      window.alert(e?.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const onTestSend = async () => {
    try {
      await SettingsApi.testReminder({
        email: test.email || undefined,
        phone: test.phone || undefined,
        channels: Object.entries(settings.channels || {}).filter(([, v]) => v).map(([k]) => k),
      });
      window.alert('Test reminder sent.');
    } catch {
      window.alert('Test send failed.');
    }
  };

  return (
    <div>
      <h2>Settings</h2>
      {loading && <div>Loading...</div>}

      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <div className="card-header">Notification Channels</div>
        <div className="card-body">
          {['EMAIL', 'SMS', 'WHATSAPP'].map((ch) => (
            <label key={ch} className="helper-row" style={{ gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <input type="checkbox" checked={!!settings?.channels?.[ch]} onChange={() => toggle(ch)} />
              <span>{ch}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <div className="card-header">General</div>
        <div className="card-body">
          {/* Add other settings fields as necessary */}
          <button className="btn" onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <div className="card-header">Test Reminder</div>
        <div className="card-body">
          <div className="helper-row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <input className="input" type="email" placeholder="Test email" value={test.email} onChange={(e) => setTest((s) => ({ ...s, email: e.target.value }))} />
            <input className="input" placeholder="Test phone" value={test.phone} onChange={(e) => setTest((s) => ({ ...s, phone: e.target.value }))} />
            <button className="btn" onClick={onTestSend}>Send Test</button>
          </div>
        </div>
      </div>
    </div>
  );
}
