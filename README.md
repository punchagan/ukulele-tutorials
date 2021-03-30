# Uke Tutorials

# Setup 

1. Install the requirements in `requirements.txt`

2. Also setup the Next.js site

```sh
    cd site/
    yarn
    yarn dev
```

# Editor Helper

When publishing the data, you can run the check script in a separate
terminal to see if data is getting saved correctly.


```sh
ls data/* |entr ./scripts/check-data.py
```
