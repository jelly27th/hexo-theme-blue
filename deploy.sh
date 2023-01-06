#!/bin/bash
# set -o errexit

# Sample: if you use if to check error.
# hexo clean
# if [ "$?" -ne 0 ]; then echo "Error: hexo clean"; exit 1; fi # A way of writing
# if ! (hexo clean); then echo "Error: hexo clean"; exit 1; fi # another way of writing

# Sample: if you not use if to check error.
# hexo clean || (echo "Error: hexo clean"; exit 1);

echo "What do you want to do"
select operation in "hexo clean" "hexo g" "hexo algolia" "hexo d" "all"
do
    if [ "$operation" != "all" ]; then  
        $operation || (echo -e "\033[33m Error: $operation, you should try again to fix it. \033[0m"; exit 1);
        break;
    else
        hexo clean || (echo -e "\033[33m Error: hexo clean, you should try again to fix it. \033[0m"; exit 1);
        hexo g || (echo -e "\033[33m Error: hexo g, you should try again to fix it. \033[0m"; exit 1);
        hexo algolia || (echo -e "\033[33m Error: hexo algolia, you should try again to fix it. \033[0m"; exit 1);
        hexo d || (echo -e "\033[33m Error: hexo d, you should try again to fix it. \033[0m"; exit 1);
        break;
    fi
done