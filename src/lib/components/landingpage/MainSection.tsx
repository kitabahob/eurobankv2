'use client';

import { useTranslation } from 'next-i18next';

export default function MainSection() {
  const { t } = useTranslation('common');

  return (
    <section className="text-center py-20 bg-[hsl(var(--background))]">
      <h2 className="text-4xl font-extrabold">
        {t('main.hero_title', { confidence: t('main.confidence'), brand: 'Euro Bank' })}
      </h2>
      <p className="mt-4 text-lg">{t('main.hero_description')}</p>
      <button className="mt-6 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-3 rounded-lg hover:bg-opacity-90">
        {t('main.get_started')}
      </button>
    </section>
  );
}
