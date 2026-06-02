# SheetSense Hub

## Product Overview

SheetSense Hub is an enterprise spreadsheet automation platform developed by RanjanLabs under the Enterprise Process Intelligence division.

The platform automates the ingestion, validation, standardization, transformation, and reporting of employee benefits enrollment data received from clients in Excel format.

Organizations often receive enrollment spreadsheets from multiple vendors, employers, and brokers. These files frequently contain inconsistent column names, varying formats, missing information, and business rule violations.

SheetSense Hub eliminates manual effort by automatically applying configurable validation and transformation rules to generate clean, standardized output files.

---

# Business Problem

A benefits administration team receives enrollment spreadsheets from multiple clients.

Each client sends data in a different format.

Example:

Client A

| FNAME | LNAME | DOB |
| ----- | ----- | --- |

Client B

| First Name | Last Name | Birth Date |
| ---------- | --------- | ---------- |

Client C

| Employee_First_Name | Employee_Last_Name | Date_Of_Birth |
| ------------------- | ------------------ | ------------- |

Even though all files contain the same information, they cannot be processed directly.

Operations teams often spend hours manually:

* Renaming columns
* Fixing invalid data
* Validating records
* Removing duplicates
* Standardizing formats

SheetSense Hub automates this entire process.

---

# Core Workflow

1. User uploads an Excel spreadsheet.
2. User selects a Plan Category.
3. User selects a Validation Profile.
4. User optionally enables Orthodontic Coverage validation.
5. SheetSense Hub processes the file.
6. Validation reports are generated.
7. Standardized output files are produced.

---

# Plan Category

Plan Category represents the benefits plan associated with the uploaded enrollment file.

## Dental Plans

### DEN:BASIC

Entry-level dental plan.

Provides standard dental coverage with basic validation requirements.

### DEN:CORE

Standard dental plan.

Includes enhanced coverage options and additional validation rules.

### DEN:PREMIER

Premium dental plan.

Supports advanced dental benefits and additional business rule validations.

## Vision Plans

### VIS:BASIC

Basic vision coverage.

### VIS:STANDARD

Standard vision coverage.

### VIS:ESSENTIAL

Essential vision benefits package.

### VIS:PLUS

Enhanced vision coverage with additional benefit options.

---

# Why Plan Category Exists

Different benefit plans require different validation rules.

Example:

Dental plans may require:

* Orthodontic eligibility validation
* Dependent age validation
* Dental coverage verification

Vision plans may require:

* Vision coverage validation
* Eligibility verification

By selecting a Plan Category, SheetSense Hub knows which business rules to apply during processing.

---

# Validation Profile

Validation Profile controls the strictness of validation performed on the uploaded file.

## STANDARD

Basic validation checks:

* Required columns exist
* Mandatory fields populated
* Empty row detection

## ADVANCED

Includes STANDARD checks plus:

* Date validation
* Duplicate member detection
* Plan validation
* Data type validation

## STRICT

Includes ADVANCED checks plus:

* Cross-record validation
* Business rule enforcement
* Data quality scoring
* Advanced integrity checks

---

# Why Validation Profiles Exist

Different organizations have different quality requirements.

Some clients only require basic validation.

Others require strict compliance before data can be loaded into downstream systems.

Validation Profiles allow administrators to control processing rigor without changing application code.

---

# Orthodontic Coverage

Orthodontic Coverage is an optional validation setting available only for Dental Plans.

The option is automatically disabled when a Vision Plan is selected.

---

# Why Orthodontic Coverage Exists

Orthodontic services such as braces and aligners are dental-specific benefits.

These benefits do not apply to Vision Plans.

When Orthodontic Coverage is enabled, SheetSense Hub executes additional dental-specific validations.

Examples:

* Orthodontic eligibility checks
* Coverage consistency validation
* Dependent eligibility verification
* Orthodontic plan code validation

This ensures that enrollment files containing orthodontic benefits comply with business requirements before processing.

---

# Data Standardization

The platform converts inconsistent source files into a common structure.

Input:

| FNAME | LNAME | Birth_Date |
| ----- | ----- | ---------- |

Output:

| firstName | lastName | dateOfBirth |
| --------- | -------- | ----------- |

This standardized format enables seamless integration with downstream systems.

---

# Transformation Engine

The transformation engine performs:

* Column standardization
* Date conversion
* Value normalization
* Data cleansing
* Business mappings
* Format alignment

Example:

Input:

01/15/1990

Output:

1990-01-15

---

# Validation Engine

The validation engine identifies:

* Missing required fields
* Invalid dates
* Duplicate records
* Invalid plan selections
* Coverage inconsistencies
* Orthodontic eligibility issues

---

# Reports Generated

## Validation Report

Displays:

* Total records processed
* Successful records
* Failed records
* Validation summary

## Error Report

Displays:

* Row number
* Column name
* Error description
* Recommended resolution

## Audit Report

Tracks:

* Uploaded file
* Processing timestamp
* User
* Validation profile used
* Processing outcome

---

# Dashboard

The dashboard provides operational visibility.

Metrics include:

* Files Processed
* Records Standardized
* Validation Success Rate
* Processing Errors
* Recent Uploads

---

# User Management

Administrators can:

* Create Users
* Assign Roles
* Manage Permissions
* View Audit History

Roles:

* Administrator
* Operations Analyst
* Business User
* Auditor

---

# Technology Stack

Frontend

* React
* Material UI

Backend

* Java Spring Boot

Database

* PostgreSQL

File Processing

* Apache POI

Deployment

* Docker
* Kubernetes

---

# Interview Summary

SheetSense Hub is a spreadsheet automation platform that processes employee benefits enrollment files.

The application standardizes incoming spreadsheets, validates records based on selected plan categories and validation profiles, applies business rules, generates audit reports, and produces clean output files ready for downstream systems.

The goal of the platform is to reduce manual processing effort, improve data quality, and ensure consistent data delivery across enterprise workflows.
