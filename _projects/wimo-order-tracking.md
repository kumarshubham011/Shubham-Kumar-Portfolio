---
layout: project
title: "WIMO — Where Is My Order"
description: "End-to-end order tracking dashboard that reduced distribution backorders by 60% across BD's global supply chain."
tech_stack: "Python, Plotly Dash, SQL Server, Azure"
featured: true
order: 1
url_live: ""
github: ""
---

## Overview

WIMO (Where Is My Order) is an Order Monitoring dashboard I designed and built at
Becton Dickinson to give supply chain teams real-time visibility into order
status across the global distribution network.

## The problem it solved

Nobody had a single view of where an order was in the pipeline.

<!-- ```mermaid
flowchart TD
    A[Order Placed] --> B[ERP System]

    B --> C{In Stock?}
    C -->|Yes| D[Pick & Pack]
    C -->|No| E[Backorder Queue]
    E --> F[WIMO Alert 🔔]
    D --> G[Shipped]
    G --> H[In Transit]
    H --> I[Delivered]
    F --> J[Planner Action]
    J --> C

```-->

## What I built

<!-- The dashboard has three main views:

**Order Status** — Live table of all open orders with status, expected ship date,
and any delay flags. Filters by region, product line, and customer segment.

**Backorder Analysis** — Which SKUs are backing up, why, and for how long.
Sortable by revenue impact so planners work the most important ones first.

**Exception Alerts** — Orders that have been sitting in one status for longer
than their SLA. Colour-coded by severity. -->

## Tech stack

<!-- Built on Plotly Dash (Python) with a SQL Server backend on Azure. Data refreshes
every 4 hours from the ERP system via a scheduled pipeline.

The choice of Dash was deliberate — the supply chain team is comfortable with
Excel and tables, not React. Dash let me build something they could actually use
without a learning curve. -->

## Results

<!-- - Distribution backorders reduced by **60%** within the first quarter
- Average time-to-resolution for backorder issues dropped from 2 days to 4 hours
- Used by **3 regional teams** across US, EMEA, and APAC -->
```
