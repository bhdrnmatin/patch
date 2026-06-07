import SubPageLayout from "../_components/SubPageLayout";

export default function RulesPage() {
  return (
    <SubPageLayout title="قوانین و مقررات">
      <div
        className="w-full text-sm text-[#253343] leading-relaxed flex flex-col gap-4"
        dir="rtl"
      >
        <p className="font-bold text-base">شرایط استفاده و قوانین پلتفرم پَدِل</p>

        <section>
          <p className="font-bold mb-2">۱) تعاریف</p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-[#445A74]">
            <li>کاربر: شخصی که حساب ایجاد می‌کند یا از خدمات استفاده می‌کند.</li>
            <li>باشگاه/کلوپ: مالک یا بهره‌بردار کورت که ظرفیت و قوانین خود را در پلتفرم ارائه می‌کند.</li>
            <li>کورت: زمین پدل قابل رزرو.</li>
            <li>مَچ: بازی ۲v۲ که عمومی یا خصوصی ساخته می‌شود.</li>
            <li>تورنومنت: رویداد رقابتی با قوانین و فرمت مشخص.</li>
            <li>رزرو بیرونی: رزروی که خارج از پلتفرم انجام و صرفاً برای برنامه‌ریزی در اپ ثبت می‌شود.</li>
          </ul>
        </section>

        <section>
          <p className="font-bold mb-2">۲) پذیرش شرایط</p>
          <p className="text-[#445A74]">
            با ایجاد حساب یا استفاده از خدمات، شما این شرایط و «سیاست حریم خصوصی» را می‌پذیرید. اگر با بخشی موافق نیستید، از خدمات استفاده نکنید.
          </p>
        </section>

        <section>
          <p className="font-bold mb-2">۳) حساب کاربری و احراز هویت</p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-[#445A74]">
            <li>ورود از طریق شماره موبایل + کد یک‌بارمصرف (OTP) انجام می‌شود.</li>
            <li>شما مسئول حفظ محرمانگی حساب و هر فعالیت مرتبط با آن هستید.</li>
            <li>حداقل سن مجاز: ۱۸ سال.</li>
            <li>ما می‌توانیم حساب‌های ناقض قوانین را تعلیق یا مسدود کنیم.</li>
          </ul>
        </section>

        <section>
          <p className="font-bold mb-2">۴) استفاده مجاز و رفتار حرفه‌ای</p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-[#445A74]">
            <li>رعایت احترام، پرهیز از آزار، تبعیض، تهدید یا هر رفتار خلاف عرف/قانون الزامی است.</li>
            <li>تقلب در نتایج یا No-Show مکرر می‌تواند به تعلیق یا کاهش «نمرهٔ رفتاری» بینجامد.</li>
            <li>محتوا/نظرات شما باید با حقوق اشخاص و دستورالعمل‌های پلتفرم سازگار باشد.</li>
          </ul>
        </section>

        <section>
          <p className="font-bold mb-2">۵) رزرو کورت</p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-[#445A74]">
            <li>نقش پلتفرم واسطهٔ فناوری است؛ مالک کورت‌ها نیست.</li>
            <li>برخی رزروها نیازمند تأیید باشگاه هستند.</li>
            <li>قیمت، تجهیزات، ایمنی و سیاست کنسلی باشگاه روی صفحهٔ هر رزرو نمایش داده می‌شود.</li>
          </ul>
        </section>

        <section>
          <p className="font-bold mb-2">۶) مسابقه‌ها و تورنومنت‌ها</p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-[#445A74]">
            <li>ساخت مَچ عمومی/خصوصی با تعیین سطح و ظرفیت امکان‌پذیر است.</li>
            <li>کاپیتان تیم نتیجه را ثبت و تیم مقابل تأیید می‌کند.</li>
            <li>قوانین تورنومنت در صفحهٔ رویداد درج می‌شود.</li>
          </ul>
        </section>

        <section>
          <p className="font-bold mb-2">۷) لغو و بازپرداخت</p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-[#445A74]">
            <li>لغو تا ۲۴ ساعت مانده به شروع: بازپرداخت کامل.</li>
            <li>لغو بین ۶–۲۴ ساعت مانده: بازپرداخت ۵۰٪.</li>
            <li>کمتر از ۶ ساعت یا No-Show: بازپرداخت ندارد.</li>
            <li>اگر باشگاه لغو کند، مبلغ شما کامل برگردانده می‌شود.</li>
          </ul>
        </section>

        <section>
          <p className="font-bold mb-2">۸) محدودیت مسئولیت</p>
          <p className="text-[#445A74]">
            تا حداکثر میزان مجاز قانون، مسئولیت کلی پلتفرم نسبت به شما از مجموع مبالغی که در سه ماه گذشته به پلتفرم پرداخت کرده‌اید بیشتر نخواهد بود.
          </p>
        </section>

        <section>
          <p className="font-bold mb-2">۹) تماس با ما</p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-[#445A74]">
            <li>ایمیل پشتیبانی: support@patchapp.ir</li>
          </ul>
        </section>
      </div>
    </SubPageLayout>
  );
}
