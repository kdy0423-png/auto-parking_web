{\rtf1\ansi\ansicpg949\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const \{ SerialPort \} = require('serialport');\
const \{ ReadlineParser \} = require('@serialport/parser-readline');\
const \{ WebSocketServer \} = require('ws');\
\
// 1. \uc0\u50937 \u49548 \u53011  \u49436 \u48260  \u44396 \u46041  (\u54252 \u53944  8080)\
const wss = new WebSocketServer(\{ port: 8080 \});\
console.log("==========================================");\
console.log("\uc0\u55357 \u56960  Node.js \u50937 \u49548 \u53011  \u49436 \u48260 \u44032  8080 \u54252 \u53944 \u50640 \u49436  \u45824 \u44592  \u51473 ...");\
console.log("==========================================");\
\
// 2. \uc0\u47589 \u48513  \u50500 \u46160 \u51060 \u45432  \u54252 \u53944  \u49444 \u51221 \
// \uc0\u55357 \u56481  [\u54596 \u49688  \u52404 \u53356 ] \u47589 \u48513  \u53552 \u48120 \u45328 \u50640  'ls /dev/tty.usb*'\u47484  \u52432 \u49436  \u45208 \u50724 \u45716  \u48376 \u51064 \u51032  \u54252 \u53944  \u51060 \u47492 \u51004 \u47196  \u48148 \u44984 \u49464 \u50836 !\
const arduinoPort = '//dev/tty.usbserial-140'; \
\
const port = new SerialPort(\{\
  path: arduinoPort,\
  baudRate: 115200 // \uc0\u50500 \u46160 \u51060 \u45432 \u51032  Serial.begin(115200)\u44284  \u51068 \u52824 \
\});\
\
// \uc0\u45936 \u51060 \u53552 \u47484  \u51460 \u48148 \u45000 (\\r\\n) \u45800 \u50948 \u47196  \u51096 \u46972  \u51069 \u45716  \u54028 \u49436  \u49444 \u51221 \
const parser = port.pipe(new ReadlineParser(\{ delimiter: '\\r\\n' \}));\
\
// 3. \uc0\u50500 \u46160 \u51060 \u45432  \u45936 \u51060 \u53552  \u49688 \u49888  \u48143  \u50937 \u51004 \u47196  \u51204 \u45804 \
parser.on('data', (data) => \{\
  // \uc0\u50500 \u46160 \u51060 \u45432 \u50640 \u49436  "\u44144 \u47532 ,\u51452 \u52264 \u49345 \u53468 " \u54805 \u53468 \u47196  \u50740  (\u50696 : "5.4,1")\
  const values = data.split(',');\
  \
  if (values.length >= 2) \{\
    const distance = values[0];\
    const status = values[1]; // "1"\uc0\u51060 \u47732  7cm \u51060 \u54616 (\u48744 \u44036 \u49353 ), "0"\u51060 \u47732  \u54217 \u49548 (\u51452 \u54889 \u49353 )\
\
    console.log(`[\uc0\u50500 \u46160 \u51060 \u45432  \u49888 \u54840 ] \u44144 \u47532 : $\{distance\}cm | \u49345 \u53468 : $\{status === '1' ? '\u55357 \u56628  \u51216 \u50976 (7cm\u51060 \u54616 )' : '\u55357 \u57312  \u48708 \u50612 \u51080 \u51020 '\}`);\
\
    // \uc0\u54788 \u51116  \u50937 \u49324 \u51060 \u53944 \u50640  \u53020 \u51256  \u51080 \u45716  \u47784 \u46304  \u48652 \u46972 \u50864 \u51200  \u53364 \u46972 \u51060 \u50616 \u53944 \u50640 \u44172  \u49892 \u49884 \u44036  \u49888 \u54840  \u51204 \u49569 \
    wss.clients.forEach((client) => \{\
      if (client.readyState === 1) \{ // \uc0\u50672 \u44208 \u51060  \u50676 \u47140 \u51080 \u45716  \u49345 \u53468 \u51068  \u46412 \u47564 \
        client.send(status); \
      \}\
    \});\
  \}\
\});\
\
// \uc0\u49884 \u47532 \u50620  \u54252 \u53944  \u50640 \u47084  \u52376 \u47532 \
port.on('error', (err) => \{\
  console.error('\uc0\u10060  \u49884 \u47532 \u50620  \u54252 \u53944  \u50640 \u47084  \u48156 \u49373 :', err.message);\
\});}
