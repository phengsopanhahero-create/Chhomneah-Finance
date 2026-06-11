"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculateMonthlyPayment, formatCurrencyUSD } from "@/lib/finance";

const DEFAULT_RATE = 14;

export function PaymentCalculator() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("1000");
  const [term, setTerm] = useState("12");
  const [rate, setRate] = useState(String(DEFAULT_RATE));

  const monthlyPayment = useMemo(() => {
    const principal = parseFloat(amount) || 0;
    const months = parseInt(term, 10) || 0;
    const annualRate = parseFloat(rate) || 0;
    return calculateMonthlyPayment(principal, annualRate, months);
  }, [amount, term, rate]);

  return (
    <Card className="border-2 border-secondary/40 bg-white">
      <CardHeader>
        <CardTitle className="lang-km text-primary">
          {t("loans.calculator_title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="calc-amount" className="lang-km">
              {t("loans.calculator_amount")}
            </Label>
            <Input
              id="calc-amount"
              type="number"
              inputMode="numeric"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calc-term" className="lang-km">
              {t("loans.calculator_term")}
            </Label>
            <Input
              id="calc-term"
              type="number"
              inputMode="numeric"
              min={1}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calc-rate" className="lang-km">
              {t("loans.interest_rate")} (%)
            </Label>
            <Input
              id="calc-rate"
              type="number"
              inputMode="decimal"
              min={0}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-lg bg-primary/10 p-4 text-center">
          <p className="lang-km text-sm font-semibold text-primary/80">
            {t("loans.calculator_result")}
          </p>
          <p className="text-3xl font-extrabold text-primary">
            {formatCurrencyUSD(monthlyPayment)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
