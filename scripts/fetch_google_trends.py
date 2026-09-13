import os
import sys
import json
import time

try:
    from pytrends.request import TrendReq
except ImportError:
    print("pytrends not yet installed or importable.")
    sys.exit(1)

def fetch_trends():
    print("Fetching fresh Google Trends data...")
    pytrends = TrendReq(hl='en-US', tz=360, timeout=(10, 25))
    
    keywords_to_probe = [
        "GTA 6",
        "Crimson Desert",
        "Hollow Knight Silksong",
        "Xbox Game Pass",
        "upcoming games 2026",
        "Death Stranding 2",
        "Resident Evil 9",
        "Metroid Prime 4",
        "Monster Hunter Wilds",
        "Wolverine game"
    ]
    
    results = {
        "fetchedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "trendingTopics": [],
        "relatedQueries": {},
        "risingQueries": {},
        "suggestions": {}
    }
    
    print("Querying Google Trends suggestions...")
    for kw in keywords_to_probe:
        try:
            suggs = pytrends.suggestions(kw)
            results["suggestions"][kw] = suggs
            print(f"  Suggestions for '{kw}': {len(suggs)} items")
            time.sleep(0.5)
        except Exception as e:
            print(f"  Error on suggestions '{kw}': {e}")
            
    batches = [
        ["GTA 6", "Crimson Desert", "Hollow Knight Silksong"],
        ["Xbox Game Pass", "upcoming games 2026"],
        ["Death Stranding 2", "Metroid Prime 4"]
    ]
    
    for batch in batches:
        try:
            print(f"Building payload for batch: {batch}")
            pytrends.build_payload(batch, cat=8, timeframe='today 3-m', geo='US')
            related = pytrends.related_queries()
            for kw in batch:
                if kw in related:
                    top_df = related[kw].get('top')
                    rising_df = related[kw].get('rising')
                    
                    results["relatedQueries"][kw] = (
                        top_df.to_dict(orient='records') if top_df is not None and not top_df.empty else []
                    )
                    results["risingQueries"][kw] = (
                        rising_df.to_dict(orient='records') if rising_df is not None and not rising_df.empty else []
                    )
                    print(f"  '{kw}' -> {len(results['relatedQueries'][kw])} top, {len(results['risingQueries'][kw])} rising")
            time.sleep(2)
        except Exception as e:
            print(f"  Error querying batch {batch}: {e}")
            
    out_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, 'google_trends_fresh.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)
        
    print(f"Successfully saved fresh Google Trends data to {out_file}")

if __name__ == '__main__':
    fetch_trends()
