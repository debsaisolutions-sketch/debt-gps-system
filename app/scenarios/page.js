"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { toCurrency } from "../lib/format";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString();
}

export default function ScenariosPage() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("Loading saved scenarios...");

  useEffect(() => {
    async function loadRows() {
      if (!supabase) {
        setStatus("Supabase environment variables are missing.");
        return;
      }

      const { data, error } = await supabase
        .from("client_scenarios")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setStatus(error.message);
        return;
      }

      setRows(data || []);
      setStatus("");
    }

    loadRows();
  }, []);

  return (
    <main className="page">
      <section className="hero">
        <h1>Saved Scenarios Dashboard</h1>
        <p>
          This is your first advisor dashboard. Every saved client scenario shows up
          here so you can track prospects, review cases, and grow this into a full
          Debt GPS system.
        </p>
        <div className="top-actions">
          <Link className="button-link ghost" href="/calculator">Back to Strategy Tool</Link>
        </div>
      </section>

      {status ? (
        <section className="empty">{status}</section>
      ) : rows.length === 0 ? (
        <section className="empty">
          No saved scenarios yet. Go back to the tool, save a scenario, and it will appear here.
        </section>
      ) : (
        <section className="list-grid">
          {rows.map((row) => (
            <article key={row.id} className="scenario-card">
              <div className="scenario-head">
                <div>
                  <div className="scenario-name">{row.client_name || "Unnamed Client"}</div>
                  <div className="subtle">{row.email || "No email provided"}</div>
                </div>
                <div className="subtle">{formatDate(row.created_at)}</div>
              </div>

              <div className="kpi-row">
                <div className="kpi"><div className="small">Total Debt</div><strong>{toCurrency(row.total_debt)}</strong></div>
                <div className="kpi"><div className="small">Debt-Free Month</div><strong>{row.debt_free_month || "—"}</strong></div>
                <div className="kpi"><div className="small">Projected Banking Strategy net</div><strong>{toCurrency(row.projected_policy_value)}</strong></div>
                <div className="kpi"><div className="small">Interest Saved</div><strong>{toCurrency(row.interest_saved)}</strong></div>
              </div>

              <div className="table-wrap">
                <table>
                  <tbody>
                    <tr><th>Current Monthly Payment</th><td>{toCurrency(row.current_monthly_payment)}</td></tr>
                    <tr><th>Redirect Payment</th><td>{toCurrency(row.redirect_payment)}</td></tr>
                    <tr><th>Monthly Banking Strategy contribution</th><td>{toCurrency(row.monthly_policy_contribution)}</td></tr>
                    <tr><th>Annual cash value growth</th><td>{row.annual_policy_growth ?? 0}%</td></tr>
                    <tr><th>Projection Years</th><td>{row.projection_years ?? 0}</td></tr>
                    <tr><th>Notes</th><td>{row.notes || "—"}</td></tr>
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
