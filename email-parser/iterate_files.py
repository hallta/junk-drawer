import os
import re

directory = 'emails'
for file_name in os.listdir(directory):
    file = open(os.path.join(directory, file_name), 'r')
    from_str = re.sub(r'[^0-9a-zA-Z@]+', '_', file.readline().strip('\n'))
    body_len = len(file.read())
    print('"' + from_str + '","' + str(body_len) + '"')


    
