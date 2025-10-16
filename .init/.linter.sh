#!/bin/bash
cd /home/kavia/workspace/code-generation/smart-invoice-and-payment-reminder-system-4219-4235/invoice_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

