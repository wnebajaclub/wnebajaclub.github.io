# Planner → Countdown sync

The countdown page (`countdown.html`) shows each milestone's checklist from **Microsoft Planner**.
A Power Automate flow copies the plan into `tasks.json` in this repo every 10 minutes; the page reads that file.
Check a task off in Planner → the website shows it done within ~10–15 minutes.

```
Planner plan ──(Power Automate, every 10 min)──> tasks.json in GitHub ──> countdown.html
```

Until the flow has run once, the page uses the task lists written in `countdown.html`.

---

## 1. Set up the Planner plan

The team plan is **Vehicle Deadlines**.

1. It must belong to a Microsoft 365 group or Teams team (not a personal "My plan").
2. **One bucket per milestone**, starting with the milestone's name from `countdown.html`:
   `Rolling Car - Deadlines`, `Engine Startup`, `First Drive`, … (extra words after the name, capitals and punctuation don't matter).
3. Optional: a task named exactly like the milestone (e.g. `Rolling Car`) is the milestone itself. Completing it marks the milestone done on the site; it isn't shown in the checklist.
4. Add the tasks to the buckets, assign people, set due dates.
   - **Done** = the task is marked complete in Planner.
   - Milestone **dates** still come from `countdown.html` (the `DEADLINES` list).
   - Buckets that don't match a milestone are ignored.

## 2. Make a GitHub token (signed in as the account that owns the repo)

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Name: `Planner sync`. Expiration: the longest allowed (set a reminder to renew it).
3. Repository access: **Only select repositories** → `wnebajaclub.github.io`.
4. Permissions → Repository permissions → **Contents: Read and write**. Nothing else.
5. Generate and copy the token. Keep it only inside the flow; never commit it to the repo.

## 3. Build the flow in Power Automate

Create → **Scheduled cloud flow** → name `GBR Planner sync`, repeat every **10 minutes**.

Add these actions in order. **Rename each action exactly as shown** (… menu → Rename) — the expressions refer to those names.

| # | Action | Rename to | Settings |
|---|--------|-----------|----------|
| 1 | Planner → **List buckets** | `List buckets` | Group Id + Plan Id: pick your plan |
| 2 | Planner → **List tasks** | `List tasks` | Same Group Id + Plan Id |
| 3 | Office 365 Groups → **List group members** | `List group members` | Same group |
| 4 | Data Operation → **Select** | `Buckets` | From: `body('List_buckets')?['value']` — Map (switch to key/value): `id` → `item()?['id']`, `name` → `item()?['name']` |
| 5 | Data Operation → **Select** | `Tasks` | From: `body('List_tasks')?['value']` — Map below |
| 6 | Data Operation → **Select** | `People` | From: `body('List_group_members')?['value']` — Map: `id` → `item()?['id']`, `displayName` → `item()?['displayName']` |
| 7 | Data Operation → **Compose** | `Data` | Inputs: expression below |
| 8 | HTTP → **HTTP** | `Get file` | GET, see below |
| 9 | Control → **Condition** | `Changed` | see below |
| 10 | HTTP → **HTTP** (inside **True**) | `Save file` | PUT, see below |

Type every value marked as an expression into the **fx / expression** box, not as plain text.

**5 · Tasks map**

| Key | Value (expression) |
|-----|--------------------|
| `title` | `item()?['title']` |
| `bucketId` | `item()?['bucketId']` |
| `percentComplete` | `item()?['percentComplete']` |
| `dueDateTime` | `item()?['dueDateTime']` |
| `assignments` | `coalesce(item()?['_assignments'], item()?['assignments'])` |

**7 · Data** (expression)

```
setProperty(setProperty(setProperty(json('{"source":"planner"}'), 'buckets', body('Buckets')), 'people', body('People')), 'tasks', body('Tasks'))
```

**8 · Get file**

- Method: `GET`
- URI: `https://api.github.com/repos/wnebajaclub/wnebajaclub.github.io/contents/tasks.json?ref=main`
- Headers:
  - `Authorization` : `Bearer YOUR_TOKEN`
  - `Accept` : `application/vnd.github+json`
  - `User-Agent` : `gbr-planner-sync`
- Settings → turn on **Secure inputs** and **Secure outputs** (hides the token in run history).

**9 · Changed** — only saves when something in Planner actually changed, so the site isn't redeployed every 10 minutes.

Left side (expression):

```
equals(string(removeProperty(json(base64ToString(replace(body('Get_file')?['content'], decodeUriComponent('%0A'), ''))), 'updated')), string(outputs('Data')))
```

Operator: **is equal to** · Right side: `false` (expression)

**10 · Save file** (in the **True** branch)

- Method: `PUT`
- URI: `https://api.github.com/repos/wnebajaclub/wnebajaclub.github.io/contents/tasks.json`
- Headers: same three as Get file
- Body:

```
{
  "message": "Sync tasks from Planner",
  "branch": "main",
  "sha": "@{body('Get_file')?['sha']}",
  "content": "@{base64(string(setProperty(outputs('Data'), 'updated', utcNow())))}"
}
```

- Settings → **Secure inputs** on.

Save → **Test → Manually**. A good run adds a "Sync tasks from Planner" commit and the page's checklist footer changes to **"Live from Microsoft Planner · synced …"**.

## Troubleshooting

- **Checklist still shows the old HTML list** — a bucket name doesn't match a milestone name. Open the page, press F12 → Console; unmatched buckets are listed there.
- **No names next to tasks** — people assigned in Planner must be members of the plan's group.
- **Get file fails with 401/403** — token expired or missing *Contents: Read and write* on this repo.
- **A commit every 10 minutes even with no changes** — the Changed check isn't matching; re-check the expression in step 9.
- **Don't edit `tasks.json` by hand** — the flow overwrites it.
