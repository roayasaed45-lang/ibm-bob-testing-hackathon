import { useLanguage } from "@/contexts/LanguageContext";
import { Layers3 } from "lucide-react";
import MobilePageHeader from "@/components/MobilePageHeader";

const Categories = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title={t("categories")} />

      <main className="px-5 py-10">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Layers3 className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-2xl font-bold mb-2">
  {t("categories")}
</h1>

          <p className="text-muted-foreground mb-6">
           {t("categoriesComingSoonDesc")}
          </p>

          <div className="border border-border rounded-2xl p-6">
            <p className="text-lg font-semibold">
  {t("categoriesComingSoon")}
</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Categories;
