---
version: 1.0
name: seyma-ekici-portfolio-design
description: "Siyah-beyazdan uzaklaşan, butter yellow'u ana nota alan, sıcak nötrlerle desteklenmiş bir portfolyo sistemi. İskelet (nav, footer, grid, kart yapısı) kurumsal ve derli toplu kalır; 'patlama' sadece 2-3 stratejik noktada (hero rozeti, proje kartı köşe etiketi) görünür — nav ve footer'a asla taşmaz. Gece modu saf siyah değil, sıcak espresso tonundadır."

colors:
  light:
    background: "#FDF8EC"
    surface: "#FFFCF5"
    text-primary: "#2B2420"
    text-muted: "#6B5D45"
    text-subtle: "#8A7A5C"
    border: "#E3D7B8"
    accent-primary: "#E8C547"
    accent-primary-ink: "#3A2B06"
    accent-burst: "#E7B49C"
    accent-burst-ink: "#5C2A1C"
  dark:
    background: "#221E19"
    surface: "#2A2520"
    text-primary: "#F3E9D8"
    text-muted: "#C9BDA3"
    text-subtle: "#A89878"
    border: "#3A332B"
    accent-primary: "#E8C547"
    accent-primary-ink: "#3A2B06"
    accent-burst: "#C98B6E"
    accent-burst-ink: "#2E150C"

typography:
  family-sans: "Geist Sans, system-ui, sans-serif"
  family-mono: "Geist Mono, ui-monospace, monospace"
  scale:
    hero: { size: "clamp(2.75rem, 5vw, 4.5rem)", weight: 500, lineHeight: 1.05, letterSpacing: "-0.02em" }
    h1: { size: "2.25rem", weight: 500, lineHeight: 1.15, letterSpacing: "-0.015em" }
    h2: { size: "1.5rem", weight: 500, lineHeight: 1.2 }
    h3: { size: "1.125rem", weight: 500, lineHeight: 1.3 }
    body-lg: { size: "1.125rem", weight: 400, lineHeight: 1.6 }
    body: { size: "1rem", weight: 400, lineHeight: 1.6 }
    body-sm: { size: "0.875rem", weight: 400, lineHeight: 1.55 }
    label-mono: { size: "0.6875rem", weight: 500, lineHeight: 1.3, letterSpacing: "0.08em", family: mono }

radius:
  sm: "8px"
  md: "12px"
  lg: "20px"
  pill: "999px"

spacing:
  xxs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
  section: "96px"

components:
  button-primary:
    background: "{colors.accent-primary}"
    color: "{colors.accent-primary-ink}"
    radius: "{radius.md}"
    padding: "10px 18px"
  button-secondary:
    background: transparent
    border: "1px solid {colors.border}"
    color: "{colors.text-primary}"
    radius: "{radius.md}"
    padding: "10px 18px"
  card-project:
    background: "{colors.surface}"
    border: "1px solid {colors.border}"
    radius: "{radius.lg}"
    padding: "24px"
    shadow: none
  badge-burst:
    background: "{colors.accent-burst}"
    color: "{colors.accent-burst-ink}"
    radius: "{radius.pill}"
    padding: "4px 12px"
    rotation: "-4deg to -6deg"
    usage: "SADECE hero'daki 'işe açığım' göstergesi ve öne çıkan proje kartlarının köşesi. Nav, footer, form veya her kartta kullanılmaz."
  nav-footer:
    background: "{colors.background}"
    color: "{colors.text-muted}"
    burst: false
    note: "Kurumsal/sakin alan. Buraya rozet, eğik eleman veya patlama rengi eklenmez."
  terminal-widget:
    background: "{colors.surface}"
    border: "1px solid {colors.border}"
    family: mono
    note: "Mevcut imza eleman; korunuyor, sadece radius ve border rengi yeni tokenlere geçiyor. Mono + etiket kullanımının sitede meşru olduğu TEK yer burası ve proje kartı slug'ı — başka hiçbir yerde dekoratif mono/caps etiket veya bölüm numarası yok."
---

## Genel Bakış

Bu doküman, portfolyonun siyah-beyaz/keskin-border estetiğinden **sıcak, butter-yellow ağırlıklı** bir dile geçişinin referans kaynağıdır. Amaç: ziyaretçi hem kurumsal yetkinliğini hem de kişiliğini (dinamik/enerjik, "clean girl" havası) aynı anda hissetsin. Bunu iki katmanla sağlıyoruz:

- **İskelet (kurumsal katman):** grid, nav, footer, form, proje kartlarının yapısı — sakin, öngörülebilir, temiz.
- **Patlama (kişisel katman):** sadece 2-3 noktada görünen, hafif eğik rozet/etiketler — hero'daki durum göstergesi ve proje kartı köşesi. Bilinçli olarak **nav ve footer'a taşınmaz.**

## Renkler

**Gündüz:** Zemin `#FDF8EC` saf beyaz değil, krem — metin `#2B2420` saf siyah değil, sıcak kömür. Ana aksan `#E8C547` (butter yellow) tüm CTA ve vurgularda kullanılır. `#E7B49C` sadece burst rozetlerinde.

**Gece:** Zemin `#221E19` — mavi-siyah değil, sıcak espresso. "İç karartıcı" hissi buradan kaçınılıyor: ton siyaha değil kahveye yakın. Metin `#F3E9D8` sıcak krem. Aynı `#E8C547` aksanı koyu zeminde de aynen kullanılır — iki modda da marka tanınabilirliği korunur.

> Not: Burst rengi (`#E7B49C` / `#C98B6E`), "AI tasarımı" klişelerinden biri olan krem-zemin + terracotta-aksan kombinasyonuna (~`#D97757`, Claude'un kendi arayüz rengi) yakın bir aile. Bizim versiyonumuz daha soluk/pembemsi ve sadece küçük rozetlerde kullanıldığı için baskın bir "tell" olmuyor, ama ileride biri "bu siteyi AI yaptı" hissi verirse ilk bakılacak yer burası.

## Tipografi

Mevcut Geist Sans / Geist Mono ikilisi korunuyor — font değişmiyor, sadece ölçek daha kasıtlı tanımlandı (yukarıdaki `scale`).

**Karar (kesinleşti): Dekoratif eyebrow etiketleri ve bölüm numaraları tamamen kaldırılıyor.** Gerekçe: `01/02/03/04/05` gerçek bir sıra/süreç ifade etmiyor, bu yüzden anlamsız bir süsleme; her başlığın üstüne ALL-CAPS mono etiket koymak da mono fontu "imza eleman" olmaktan çıkarıp her yerde görülen bir şablon tikine çeviriyor — asıl imza olan terminal widget'ını sıradanlaştırıyor.

Somut olarak kaldırılanlar:
- `SectionHeading` içindeki `01 / PORTFOLYO` türü index+etiket satırı → başlık artık sadece kendi tipografik ağırlığıyla (`h1`/`h2` scale + boşluk) hiyerarşisini kuruyor, önüne hiçbir şey eklenmiyor.
- Hero'daki `SİSTEM DURUMU / ÇALIŞIYOR` durum etiketi ve `hero.eyebrow` (`Bağımsız yazılımcı · Türkiye`) satırı → yeşil nokta gösterge istenirse kalabilir ama metin etiketi olmadan; hero direkt başlıkla açılabilir.
- `stats` bölümündeki `DENEYİM / ODAK / MİMARİ / KONUM` mono caps etiketleri → değer büyük ve net kalır, üstündeki kategori etiketi caps/mono olmayan sade bir alt yazıya döner ya da tamamen kalkar.
- `skillsGroups` başlıkları, `experienceBlock.currentPractice`, `garden` satırlarındaki hem numara (`01/02/03`) hem caps etiket → aynı mantıkla sadeleşiyor.
- `featuredProjects.heading` ve `entries` sayacı (`00 ENTRIES`) → başlık normal ağırlıkta, sayaç istenirse düz metin.

Mono fontun sitede kalan **tek** meşru kullanım alanı: `MiniTerminal` widget'ının içeriği (zaten kod/terminal simülasyonu) ve proje kartındaki `/slug` gibi gerçek kod benzeri veri. Kategori/bölüm etiketi olarak bir daha kullanılmıyor.

## Şekil & Boşluk

Keskin köşeli border-kutu dili yerine yumuşak radius (`{radius.lg}` = 20px kart, `{radius.md}` = 12px buton) — bu tek değişiklik "kurumsal sert kutu" hissini önemli ölçüde "clean girl" tarafına yaklaştırıyor. Spacing skalası Linear referansındaki 4px bazlı sistemle aynı mantıkta (`xxs`→`section`), sayfa ritminde zaten var olan bolluk korunuyor.

## Patlama Yerleşim Kuralı

**Var:**
- Hero'daki "işe açığım" göstergesi → `badge-burst`, hafif eğik
- Öne çıkan proje kartlarının sağ üst köşesi → aynı rozet pattern'i, farklı metin

**Yok (bilinçli karar):**
- Nav linkleri, footer, form elemanları, admin panel — bunlar `nav-footer` tokenini kullanır, burst rengi görmez
- Her kart/her bölüm — burst'ü yaygınlaştırmak onu sıradanlaştırır

## Gece Modu Felsefesi

Gece modu "aydınlığın kapatılması" değil, "aynı sıcaklığın farklı bir saatte görünmesi." Bu yüzden ton kaymasını mavi-siyaha değil kahverengiye doğru yaptık — espresso fincanı gibi, dinlendirici ama kasvetli değil.

## Envanter & Uygulama Sırası

Admin panel bu redesign'ın kapsamına dahil edildi (ayrı bir dil olarak bırakılmıyor). Uygulama sırası:

1. **Temel katman:** `globals.css` (yeni token seti), `components/ui/button.tsx` (yeni renklere geçiş; homepage CTA'larının ham `<a>` yerine bu bileşeni kullanıp kullanmayacağı burada netleşir)
2. **Çerçeve (burst yok, sade):** `SiteHeader.tsx`, `SiteFooter.tsx`
3. **İlk izlenim (burst #1 burada):** `page.tsx` hero + stats — "işe açığım" rozeti, `SectionHeading` etiket/numara temizliği
4. **İçerik bölümleri (burst #2 burada):** `FeaturedProjects.tsx` (proje kartı köşe rozeti), Experience/skills ve Garden/Exploring blokları (etiket temizliği), `MiniTerminal.tsx` (minimal — sadece token geçişi, imza eleman korunuyor)
5. **Form ve metin:** `ContactForm.tsx`, `translations.ts` (kaldırılan etiketlerin tr/en string temizliği, ilgili bileşenle paralel)
6. **Admin panel:** `admin/login`, `admin/dashboard`, `admin/projects/new` — şu an koyu zinc-900/950 + amber-500 + rounded-xl/2xl kullanıyor, aynı token setine taşınacak. Açık soru (Tier 6'ya gelince netleşir): admin sabit koyu mu kalsın yoksa gündüz/gece toggle'ı da alsın mı?