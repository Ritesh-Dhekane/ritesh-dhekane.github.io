# MacBuy

An offline price reference, deal evaluator and market-day tracker for buying used, refurbished, demo and
open-box MacBooks in India (₹). It is one HTML file with no dependencies, no login, no backend and no
network calls after it loads.

Served at `/lab/macbuy/`.

## Run it

- **Hosted:** open `/lab/macbuy/` on the site.
- **Locally:** open `index.html` directly in a browser.
- **If `file://` blocks storage or downloads** (some browsers restrict LocalStorage or blob downloads for
  local files), run a simple local server from this folder and open the address it prints:

  ```sh
  npx serve .            # or
  python -m http.server 8000
  ```

  Then visit `http://localhost:8000/`. Data is stored per origin, so `file://`, `localhost:8000` and the
  hosted site each keep **separate** data. Use a JSON backup to move data between them.

## What it does

| Section | Purpose |
|---|---|
| Dashboard | Totals, lowest price, best deal, average, models tracked, entries above budget, Best Deals Found |
| Price Finder | Step-by-step chip → family → RAM → SSD picker (only configs in the DB) plus the Deal Evaluator |
| Market Entries | Fast **+ ADD MARKET ENTRY** form, searchable/filterable/sortable table, bulk actions, CSV export |
| Compare Listings | Side-by-side comparison of 2+ entries with a value-for-money ranking |
| Shortlist | Favourites, personal notes, best current candidate, leaderboard |
| Price Database | Reference ideal/max prices (target buying prices, not live prices): add, edit, delete, reset |
| Backup & Settings | Budget, currency display, theme, adjustments, CSV options, backup/restore, reset/clear |

### Verdicts

Prices are compared with the **adjusted** ideal and max for the configuration:

- **Excellent:** below the ideal
- **Good:** between the ideal and the max
- **Negotiate:** above the max, but by no more than the tolerance (default 5%)
- **Overpriced:** more than the tolerance above the max
- **Reject:** any serious issue ticked (major defects, MDM, Activation Lock, undisclosed repairs, other)
- **No reference:** the configuration isn't in the price DB (the entry is still saved)

Unverified units that look Excellent or Good are marked **Unverified** (provisional). If the battery is
below the lowest band, the verdict is capped at Negotiate.

### Adjustments

The reference prices assume Excellent condition, a battery at 95% or above, and no warranty. Battery
band, condition and warranty each add **one** signed amount, and the same total is applied to both the
ideal and the max. Every adjustment is shown in the breakdown. You can edit or disable each one in
Settings. These are negotiation valuations, not repair quotes.

## Back up and restore

Your data lives only in this browser's LocalStorage, in these keys: `macbuy_market_entries`,
`macbuy_price_database`, `macbuy_shortlist`, `macbuy_settings` and `macbuy_version`. Clearing browser data
deletes it. **Export a backup regularly.**

- **BACKUP ALL DATA (JSON):** a full backup of the entries, price DB, shortlist, settings, theme, budget
  and app version.
- **RESTORE FROM JSON:** validates the file and shows a summary. You then choose:
  - **Merge:** adds only the entries, prices and shortlist items you don't already have.
  - **Replace all data:** replaces everything, after a second confirmation.
- **EXPORT MARKET ENTRIES (CSV):** exports the filtered or all entries as UTF-8 with a BOM, so Excel
  opens it correctly. The standard columns come first. With the **extra columns** option on (the
  default), screen, CPU, contact, colour, photo reference, repair history, issues, verified and timestamp
  are added at the end so a re-import loses nothing. Serial numbers are never written to CSV.
- **IMPORT CSV:** parses quoted fields and shows a preview with new, duplicate-ID and invalid rows. For
  duplicate IDs you choose **skip**, **update** (only the columns present in the CSV are overwritten) or
  **duplicate** (imported with new IDs).

Nothing is overwritten without a confirmation step. If stored data is ever unreadable, the app loads
defaults and offers to download the unreadable data before your next save replaces it.
