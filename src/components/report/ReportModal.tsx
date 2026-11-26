import { Check, Copy, Printer, X } from 'lucide-react';
import { useState } from 'react';
import { getTranslations } from '../../i18n/translations';
import { useSolarStore } from '../../store/useSolarStore';
import { formatClientReportText } from '../../utils/reportFormatter';

/**
 * Modal Laporan Simulasi PLTS (Light & Dark, Bilingual ID/EN).
 */
export function ReportModal() {
  const [copied, setCopied] = useState(false);

  const isOpen = useSolarStore((state) => state.isReportModalOpen);
  const setOpen = useSolarStore((state) => state.setReportModalOpen);
  const clientName = useSolarStore((state) => state.clientName);
  const setClientName = useSolarStore((state) => state.setClientName);
  const config = useSolarStore((state) => state.config);
  const results = useSolarStore((state) => state.results);
  const lang = useSolarStore((state) => state.lang);
  const captureSnapshotForPrint = useSolarStore((state) => state.captureSnapshotForPrint);

  if (!isOpen) return null;

  const t = getTranslations(lang).report;
  const locale = lang === 'en' ? 'en-US' : 'id-ID';
  const unitLabel = lang === 'en' ? 'units' : 'unit';
  const hoursLabel = lang === 'en' ? 'hrs' : 'jam';

  const summaryText = formatClientReportText(clientName, config, results, lang);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      const el = document.createElement('textarea');
      el.value = summaryText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handlePrint = () => {
    captureSnapshotForPrint();
    setTimeout(() => window.print(), 60);
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 bg-zinc-900/50 dark:bg-black/75 backdrop-blur-[1px] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="bg-white dark:bg-[#111114] border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-md max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header Modal */}
        <div className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3
              id="report-modal-title"
              className="font-semibold text-sm text-zinc-900 dark:text-zinc-100"
            >
              {t.modalTitle}
            </h3>
            <p className="text-xs text-zinc-500">{t.modalSub}</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close modal"
            className="p-1 rounded text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div>
            <label
              htmlFor="inp-client-name"
              className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1"
            >
              {t.projectName}
            </label>
            <input
              id="inp-client-name"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-zinc-950"
            />
          </div>

          {/* Tabel Ringkasan Metrik */}
          <div className="grid grid-cols-2 sm:grid-cols-3 border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden divide-y sm:divide-y-0 divide-zinc-200 dark:divide-zinc-800 bg-zinc-50 dark:bg-zinc-950">
            <div className="p-3 border-r border-zinc-200 dark:border-zinc-800 sm:border-b">
              <div className="text-[11px] text-zinc-500">{t.panelCount}</div>
              <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 tabular-nums">
                {results.panelCount} {unitLabel} ({config.panelWp}Wp)
              </div>
            </div>
            <div className="p-3 sm:border-r border-zinc-200 dark:border-zinc-800 sm:border-b">
              <div className="text-[11px] text-zinc-500">{t.stcCap}</div>
              <div className="font-mono text-sm font-semibold text-amber-600 dark:text-amber-400 mt-0.5 tabular-nums">
                {results.totalStcKwp.toFixed(2)} kWp
              </div>
            </div>
            <div className="p-3 border-r sm:border-r-0 border-zinc-200 dark:border-zinc-800 sm:border-b">
              <div className="text-[11px] text-zinc-500">
                {t.outputAt} ({config.ambientTemp.toFixed(1)}°C)
              </div>
              <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 tabular-nums">
                {results.actualPowerKw.toFixed(2)} kW
              </div>
            </div>
            <div className="p-3 sm:border-r border-zinc-200 dark:border-zinc-800">
              <div className="text-[11px] text-zinc-500">{t.monthlyProd}</div>
              <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 tabular-nums">
                {Math.round(results.monthlyEnergyKwh).toLocaleString(locale)} kWh
              </div>
            </div>
            <div className="p-3 border-r border-zinc-200 dark:border-zinc-800">
              <div className="text-[11px] text-zinc-500">{t.inverterAc}</div>
              <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 tabular-nums">
                {config.inverterKw} kW ({results.dcAcRatio.toFixed(2)})
              </div>
            </div>
            <div className="p-3">
              <div className="text-[11px] text-zinc-500">{t.battery}</div>
              <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 tabular-nums">
                {config.batteryKwh} kWh ({results.backupHours.toFixed(1)} {hoursLabel})
              </div>
            </div>
          </div>

          {/* Teks Siap Kirim */}
          <div>
            <label
              htmlFor="report-copy-text"
              className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1"
            >
              {t.copyLabel}
            </label>
            <textarea
              id="report-copy-text"
              rows={8}
              readOnly
              value={summaryText}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-3 font-mono text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-5 py-3 bg-zinc-50 dark:bg-[#0e0e11] border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
          <span
            className={`text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 transition-opacity ${
              copied ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            {t.copied}
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded text-xs font-medium bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              {t.copyBtn}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded text-xs font-semibold bg-amber-500 hover:bg-amber-600 dark:hover:bg-amber-400 text-white dark:text-zinc-950 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              {t.printBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
