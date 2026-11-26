import { getTranslations } from '../../i18n/translations';
import { useSolarStore } from '../../store/useSolarStore';
import { formatClientReportText } from '../../utils/reportFormatter';

/**
 * Lembar Laporan Cetak (Hanya tampil saat dialog Print / Save as PDF aktif).
 */
export function PrintReportSheet() {
  const clientName = useSolarStore((state) => state.clientName);
  const config = useSolarStore((state) => state.config);
  const results = useSolarStore((state) => state.results);
  const lang = useSolarStore((state) => state.lang);
  const printSnapshotUrl = useSolarStore((state) => state.printSnapshotUrl);

  const t = getTranslations(lang).report;
  const formattedDate = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const summaryText = formatClientReportText(clientName, config, results, lang);

  return (
    <div className="print-only hidden p-8 max-w-4xl mx-auto bg-white text-zinc-900">
      <div className="border-b-2 border-zinc-800 pb-4 mb-6 flex justify-between items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            {t.printHeader}
          </span>
          <h1 className="text-2xl font-bold mt-1">
            {clientName.trim() || t.defaultProject}
          </h1>
        </div>
        <div className="text-right text-xs text-zinc-600">
          <p>{formattedDate}</p>
          <p>SolarSim 3D</p>
        </div>
      </div>

      {printSnapshotUrl && (
        <div className="mb-6 border border-zinc-300 rounded-lg overflow-hidden">
          <img
            src={printSnapshotUrl}
            alt="SolarSim 3D View"
            className="w-full max-h-80 object-cover"
          />
        </div>
      )}

      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-800">
        {summaryText}
      </pre>
    </div>
  );
}
