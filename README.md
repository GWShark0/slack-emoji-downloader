# slack-emoji-downloader

A simple Node.js script to bulk-download emoji from Slack.

## Usage (Requires Node.js 18+)

```
node download emoji.json
```

After the script runs, the downloaded emoji can be found in `/emoji`.

## Data File Format

The `emoji.json` data file must have the following format:

```json
{
  "emoji": {
    "a": "https://...",
    "b": "https://...",
    "c": "https://..."
  }
}
```

where `"a"` and `"b"` are the names of the emoji followed by the url.

## Obtaining an `emoji.json` File

See:

- https://api.slack.com/methods/emoji.list
- https://danhughes.io/2020/04/scraping-slack-emojis-for-fun-and-profit
- https://gist.github.com/lmarkus/8722f56baf8c47045621
