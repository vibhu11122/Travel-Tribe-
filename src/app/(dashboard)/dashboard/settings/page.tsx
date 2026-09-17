export default function SettingsPage() {
  return (
    <div className="max-w-xl space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-card border border-navy/5">
        <h3 className="font-headline font-black text-navy text-lg mb-5">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { label: 'New trip launches', desc: 'Get notified when new trips are added' },
            { label: 'Trip reminders', desc: 'Reminders 7 days before your trip' },
            { label: 'Community updates', desc: 'Updates from the Travel Tribe community' },
            { label: 'Promotional offers', desc: 'Exclusive deals and offers' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-navy/5 last:border-0">
              <div>
                <p className="font-semibold text-navy text-sm">{item.label}</p>
                <p className="text-navy/50 text-xs">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-10 h-6 bg-navy/20 rounded-full peer peer-checked:bg-orange transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-card border border-navy/5">
        <h3 className="font-headline font-black text-navy text-lg mb-5">Account</h3>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 rounded-lg border border-navy/10 text-navy font-semibold text-sm hover:bg-cream-dark transition-colors">
            Change Password
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
