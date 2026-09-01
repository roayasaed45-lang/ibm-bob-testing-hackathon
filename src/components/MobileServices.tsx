import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Scissors } from "lucide-react";

const MobileServices = () => {
  const { t } = useLanguage();

  const services = [
    {
      title: t("haircut"),
      desc: t("haircutDesc"),
      price: t("haircutPrice"),
    },
    {
      title: t("childHaircut"),
      desc: t("childHaircutDesc"),
      price: t("childHaircutPrice"),
    },
    {
      title: t("straightening"),
      desc: t("straighteningDesc"),
      price: t("straighteningPrice"),
    },
    {
      title: t("facialMask"),
      desc: t("facialMaskDesc"),
      price: t("facialMaskPrice"),
    },
    {
      title: t("barberAtHome"),
      desc: t("barberAtHomeDesc"),
      price: t("barberAtHomePrice"),
    },
    {
      title: t("groomHaircut"),
      desc: t("groomHaircutDesc"),
      price: "",
    },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-3">{t("servicesTitle")}</h2>
      </div>

      <div className="space-y-3">
        {services.map((service, index) => (
          <Card key={index} className="p-4 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Scissors className="w-5 h-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-base leading-6">
                    {service.title}
                  </h3>

                  {service.price && (
                    <span className="text-sm font-bold text-primary whitespace-nowrap">
                      {service.price}
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mt-1 leading-5">
                  {service.desc}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default MobileServices;
