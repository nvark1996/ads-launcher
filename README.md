# Ads Launcher

A small Chrome extension for media buyers who manage many ad accounts. Click the toolbar icon (or press a shortcut), type a few letters of a client's name, press Enter, and that client's Ads Manager opens. You never have to search for the account again.

It works with **Meta Ads Manager**, **Google Ads** and **TikTok Ads Manager**, and with any other link you want to keep there.

## Why it matters

If you run ads for many clients, getting to the right account is slower than it should be:

- **Every client lives in a different place.** Each brand often has its own Business Manager (business portfolio), and Meta only opens an account directly when the link carries both the ad account ID and the business ID. Without the right link you go through Business Suite, the business switcher and the account switcher every time.
- **The switchers are slow and crowded.** With 10, 20 or 50 accounts, the account dropdown means scrolling, waiting for it to load and squinting at similar names or long ID numbers.
- **Bookmarks go stale.** A link copied from the address bar carries a fixed date range, a session ID and tracking parameters. Open it next month and you're looking at the wrong dates.
- **Wrong-account mistakes are expensive.** When you jump between accounts all day, it's easy to edit a budget, duplicate a campaign or launch ads in the wrong account. Opening exactly the account you named every time removes that risk.
- **It adds up.** Thirty seconds to a minute per account switch, dozens of times a day, is real time lost every week.

Ads Launcher turns all of that into **two keystrokes**: open the popup, type the first letters of a client's name, press Enter, and you're in that client's campaigns.

## Use cases

- **Daily checks:** open every client's Ads Manager in the morning with Cmd+click, without hunting for each one.
- **Agencies and freelancers:** keep agency clients and freelance clients apart with groups, and switch between them instantly.
- **Client calls and meetings:** a client asks "how is the campaign doing?" and you have their account open in two seconds, not after a minute of clicking through switchers.
- **Reporting days:** go through the accounts one by one in the order of your list, so none are missed.
- **Multi-platform clients:** keep a client's Meta, Google Ads and TikTok accounts side by side under the same group.
- **Team handover:** a new teammate can fill their own `my-links.js` from yours, so they reach every account on day one.
- **Anything you open often:** Events Manager, billing pages, Business Settings, a client's reporting dashboard. Any link works.

## Features

- **Search as you type:** filter accounts by name or group, then press **Enter** to open the top result. Use **↑ / ↓** to move through the list.
- **One click to open:** a plain click opens the account in a new tab. **Cmd+click** (or Ctrl+click) opens it in the background and keeps the list open, so you can open several accounts at once.
- **Keyboard shortcut:** **Control+Shift+A** on Mac, **Alt+Shift+A** on Windows and Linux. Change it at `chrome://extensions/shortcuts`.
- **+ Add this page:** while you're on any account in Ads Manager, click it, type a name (and an optional group), and it's saved.
- **Clean links:** for Meta Ads Manager links, only the account details (`act`, `business_id`, `global_scope_id`) are kept. Date ranges, session IDs and tracking parameters are dropped, so the account always opens on Ads Manager's normal date range rather than an old one you happened to copy.
- **Groups:** give accounts a group (e.g. "Agency", "Freelance") and the list is split into sections.
- **Platform badges:** Meta accounts get a blue **M**, Google a green **G**, TikTok a black **T**.
- **Edit mode:** click **Edit** to show an × beside each account and remove it.
- **Light and dark mode** follow your system setting.

## Install

The extension isn't in the Chrome Web Store, so you load it once from the folder.

1. Download this repo: click **Code → Download ZIP** and unzip it, or run:
   ```bash
   git clone https://github.com/nvark1996/ads-launcher.git
   ```
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (switch in the top-right corner).
4. Click **Load unpacked** and select the `ads-launcher` folder.
5. Click the puzzle-piece icon in Chrome's toolbar and **pin** Ads Launcher.

It also works in other Chromium browsers, such as Edge, Brave and Arc.

## Adding your accounts

There are two ways. Use either or both.

**1. From the popup (easiest).** Open an account in Ads Manager, click the Ads Launcher icon, click **+ Add this page**, type a name and click **Save**. These accounts are stored in your Chrome profile (`chrome.storage.sync`), so they follow you to other computers where you're signed into Chrome with sync on.

**2. From a file (good for a long list).** Copy `my-links.example.js` to `my-links.js` and put your accounts in it:

```js
var MY_LINKS = [
  { name: "Client A", url: "https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=1234567890&business_id=1234567890", group: "Agency" },
  { name: "Client B", url: "https://ads.google.com/aw/overview?ocid=1234567890" },
];
```

Then click the ↻ reload arrow on the Ads Launcher card in `chrome://extensions`.

`my-links.js` is listed in `.gitignore`, so your account links are never committed if you fork or push this repo. If the file doesn't exist, the extension still works and the list starts empty. Chrome logs a harmless "file not found" message on the extension's error page in that case.

**Where to find an account's link:** open the account in Ads Manager and copy the address from the address bar. For Meta, the part that matters is `act=` (the ad account ID) plus `business_id=`. Ads Launcher strips the rest when you use **+ Add this page**.

## Privacy

- No servers, analytics or tracking. The extension makes no network requests of its own.
- It only opens the links you saved. It never reads your ads data, and it can't log in to or change your accounts.
- Permissions:
  - `storage` saves the accounts you add.
  - `activeTab` reads the current tab's address, only when you click **+ Add this page**.

## Files

| File | What it does |
|---|---|
| `manifest.json` | Extension settings: name, icon, permissions, shortcut |
| `popup.html` / `popup.css` / `popup.js` | The popup: search, list, add, edit |
| `my-links.example.js` | Template for your private account list |
| `my-links.js` | Your private account list (create it yourself; never committed) |
| `icons/` | Toolbar icons |

## License

MIT. See [LICENSE](LICENSE).
