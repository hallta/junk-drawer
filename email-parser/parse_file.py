import re

f = open("input", "r")
the_string = f.read()

m = re.split(r'From:?\s', the_string)

x=0
for n in m:
    x = x + 1 
    with open(str(x) + ".txt", 'a') as f:
        f.write("From: " + n)