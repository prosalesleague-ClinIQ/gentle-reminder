/**
 * NDA Templates
 * CONFIDENTIAL — For internal use and authorized outreach only.
 *
 * IMPORTANT: These are starting templates. Have counsel review before use.
 * State-law variations may require modifications.
 */

export interface NDATemplate {
  id: string;
  label: string;
  audience: string;
  type: 'mutual' | 'unilateral-disclosing' | 'unilateral-receiving';
  body: string;
  counselReviewRequired: boolean;
  notes: string;
}

export const NDA_TEMPLATES: NDATemplate[] = [
  // ============================================================
  // MUTUAL NDA — Default for most discussions
  // ============================================================
  {
    id: 'mutual-nda',
    label: 'Mutual NDA (Bilateral)',
    audience: 'Investors, strategic partners, advisors, fractional CFOs',
    type: 'mutual',
    counselReviewRequired: true,
    body: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement (this "Agreement") is entered into as
of {{effective_date}} (the "Effective Date") by and between:

GENTLE REMINDER, INC., a Delaware corporation with its principal place of
business at {{company_address}} ("Company"); and

{{recipient_name}}, a {{recipient_entity_type}} with its principal place of
business at {{recipient_address}} ("Recipient").

The parties may be referred to individually as a "Party" and collectively as
the "Parties."

WHEREAS, the Parties wish to explore a potential business relationship (the
"Purpose"); and

WHEREAS, in furtherance of the Purpose, each Party may disclose to the other
certain Confidential Information (as defined below).

NOW, THEREFORE, in consideration of the mutual covenants contained herein,
the Parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION

"Confidential Information" means any non-public information disclosed by one
Party (the "Disclosing Party") to the other Party (the "Receiving Party"),
whether in oral, written, electronic, or other form, that is marked,
identified, or reasonably understood to be confidential, including but not
limited to:

(a) Technical information, including inventions, algorithms, source code,
    data, designs, specifications, patent applications, and know-how;
(b) Business information, including financial statements, business plans,
    strategies, customer and prospect information, pricing, and marketing;
(c) Regulatory and clinical information, including FDA submissions,
    clinical data, and regulatory strategies;
(d) Any information regarding the Purpose, including the existence and
    nature of discussions between the Parties.

2. EXCLUSIONS

Confidential Information does not include information that the Receiving
Party can demonstrate:

(a) Was in the Receiving Party's possession before receipt from the
    Disclosing Party without obligation of confidentiality;
(b) Is or becomes publicly known through no fault of the Receiving Party;
(c) Is rightfully received from a third party without obligation of
    confidentiality;
(d) Is independently developed by the Receiving Party without use of or
    reference to the Disclosing Party's Confidential Information.

3. OBLIGATIONS OF RECEIVING PARTY

The Receiving Party shall:

(a) Hold the Disclosing Party's Confidential Information in strict
    confidence;
(b) Use Confidential Information solely for the Purpose;
(c) Not disclose Confidential Information to any third party without the
    Disclosing Party's prior written consent, except to employees, officers,
    directors, contractors, attorneys, accountants, and advisors
    (collectively, "Representatives") who have a need to know for the
    Purpose and who are bound by written obligations of confidentiality at
    least as restrictive as this Agreement;
(d) Take reasonable measures to protect Confidential Information, using at
    least the same degree of care it uses to protect its own confidential
    information of similar sensitivity, but in no event less than a
    reasonable degree of care;
(e) Be responsible for any breach of this Agreement by its Representatives.

4. NO LICENSE; NO OBLIGATION TO PROCEED

No license under any patent, trade secret, trademark, copyright, or other
intellectual property right is granted by this Agreement, expressly or by
implication. Nothing in this Agreement obligates either Party to enter into
any business transaction.

5. TERM AND SURVIVAL

This Agreement is effective as of the Effective Date and continues for a
period of three (3) years, unless earlier terminated by either Party upon
thirty (30) days' written notice. The Receiving Party's obligations with
respect to Confidential Information survive termination for a period of
five (5) years from the date of disclosure (or indefinitely for trade
secrets, in accordance with applicable law).

6. RETURN OR DESTRUCTION

Upon the Disclosing Party's written request, the Receiving Party shall
promptly return or destroy all Confidential Information in its possession,
including all copies and extracts, and certify such return or destruction
in writing.

7. REMEDIES

The Parties acknowledge that breach of this Agreement may cause irreparable
harm for which monetary damages would be an inadequate remedy. Accordingly,
in addition to any other remedies available at law or in equity, the
Disclosing Party shall be entitled to seek injunctive relief and specific
performance without the necessity of posting a bond.

8. NON-SOLICITATION

For a period of one (1) year from the Effective Date, neither Party shall
directly or indirectly solicit for employment or hire any employee of the
other Party with whom such Party had substantive contact in connection
with the Purpose, without the other Party's prior written consent.
General solicitations not targeted at the other Party's employees are
permitted.

9. RESIDUAL KNOWLEDGE

Notwithstanding the foregoing, the Receiving Party may use ideas, concepts,
know-how, or techniques that are retained in the unaided memory of its
Representatives who had lawful access to Confidential Information (the
"Residuals"), provided that such Residuals are used only for the Receiving
Party's own business purposes and without disclosing the source. This
clause does not constitute a license under any patent or copyright.

10. GOVERNING LAW; JURISDICTION

This Agreement is governed by the laws of the State of Delaware, without
regard to conflict of laws principles. The Parties consent to the exclusive
jurisdiction of the state and federal courts located in Delaware for any
dispute arising under this Agreement.

11. MISCELLANEOUS

(a) Entire Agreement. This Agreement constitutes the entire agreement
    between the Parties regarding the Purpose and supersedes all prior
    discussions and agreements.
(b) Amendments. This Agreement may be amended only by a writing signed by
    both Parties.
(c) Severability. If any provision is held unenforceable, the remaining
    provisions continue in full force.
(d) Counterparts. This Agreement may be executed in counterparts, each of
    which is an original, and together constitute one instrument. Electronic
    signatures are deemed originals.
(e) Assignment. Neither Party may assign this Agreement without the other
    Party's prior written consent, except in connection with a merger,
    acquisition, or sale of substantially all assets.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the
Effective Date.

GENTLE REMINDER, INC.                   {{recipient_name}}

By: _______________________             By: _______________________
Name: {{founder_name}}                  Name:
Title: {{founder_title}}                Title:
Date: ___________                       Date: ___________`,
    notes: 'Use for: investor discussions, strategic partner exploration, fractional CFO engagement, advisor intake. 3-year term, 5-year survival is standard. Residual clause is negotiable — some partners will push back.',
  },

  // ============================================================
  // UNILATERAL NDA — We are disclosing (most IP sharing)
  // ============================================================
  {
    id: 'unilateral-nda-disclosing',
    label: 'Unilateral NDA (We Disclose)',
    audience: 'Patent attorneys, placement agents, grant collaborators, deep-dive investors',
    type: 'unilateral-disclosing',
    counselReviewRequired: true,
    body: `CONFIDENTIAL DISCLOSURE AGREEMENT

This Confidential Disclosure Agreement (this "Agreement") is entered into
as of {{effective_date}} (the "Effective Date") by and between:

GENTLE REMINDER, INC., a Delaware corporation with its principal place of
business at {{company_address}} ("Disclosing Party"); and

{{recipient_name}}, a {{recipient_entity_type}} with its principal place of
business at {{recipient_address}} ("Receiving Party").

WHEREAS, Disclosing Party owns certain confidential and proprietary
information relating to a clinical-grade dementia care software platform,
including patentable innovations, algorithms, business plans, and
regulatory strategies (collectively, "Confidential Information");

WHEREAS, Receiving Party wishes to receive Confidential Information for
the sole purpose of {{stated_purpose}} (the "Purpose").

NOW, THEREFORE, the parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION

"Confidential Information" means any information disclosed by Disclosing
Party to Receiving Party, in any form, that is marked, identified, or
reasonably understood to be confidential, including without limitation:

(a) All patentable innovations, provisional and non-provisional patent
    applications, patent claims, inventions, algorithms, software source
    code, architectural designs, and technical specifications;
(b) Business plans, financial projections, pricing, customer information,
    and fundraising strategies;
(c) Regulatory filings and strategies, clinical validation protocols, and
    FDA submission plans;
(d) Trade secrets, including specific numerical parameters, weight
    distributions, keyword dictionaries, audio feature thresholds, and
    other calibration data.

2. EXCLUSIONS

Confidential Information does not include information that the Receiving
Party can document:

(a) Was in Receiving Party's lawful possession before disclosure;
(b) Is or becomes publicly known through no breach of this Agreement by
    Receiving Party or its Representatives;
(c) Is rightfully received from a third party without obligation of
    confidentiality;
(d) Is independently developed by Receiving Party without use of or
    reference to Confidential Information.

3. RECEIVING PARTY OBLIGATIONS

Receiving Party shall:

(a) Hold Confidential Information in strict confidence;
(b) Use Confidential Information ONLY for the Purpose;
(c) Not disclose Confidential Information to any third party without
    Disclosing Party's prior written consent;
(d) Not use Confidential Information to develop, or assist any third party
    in developing, any product, service, algorithm, or system that competes
    with Disclosing Party's platform;
(e) Restrict access to Confidential Information to Representatives who:
    (i) have a need to know for the Purpose; and
    (ii) are bound by written obligations of confidentiality at least as
    restrictive as this Agreement;
(f) Take reasonable measures to protect Confidential Information, using at
    least the same degree of care it uses to protect its own confidential
    information of similar sensitivity, but in no event less than a
    reasonable degree of care;
(g) Be responsible for any breach by its Representatives.

4. PROHIBITED USES

Receiving Party SHALL NOT:

(a) Reverse-engineer, disassemble, or decompile any software or product
    disclosed;
(b) File patent applications, copyright registrations, or other
    intellectual property claims that are derived from or informed by
    Confidential Information;
(c) Publish, present, or publicly discuss Confidential Information in any
    forum without Disclosing Party's prior written consent;
(d) Use Confidential Information for investment, trading, or financial
    decisions outside the Purpose.

5. NO LICENSE; NO OBLIGATION TO PROCEED

No license under any patent, trade secret, copyright, or other intellectual
property right is granted, expressly or by implication. Nothing obligates
either party to enter into any business transaction.

6. TERM AND SURVIVAL

This Agreement is effective as of the Effective Date and continues for five
(5) years. Receiving Party's confidentiality obligations survive termination
for a period of seven (7) years from date of disclosure, or indefinitely
for trade secrets.

7. RETURN OR DESTRUCTION

Upon Disclosing Party's written request, or upon completion of the Purpose,
Receiving Party shall promptly return or destroy all Confidential
Information, including copies, extracts, derivative notes, and any analyses
prepared based on Confidential Information, and certify such in writing.

8. REMEDIES

Receiving Party acknowledges that breach may cause irreparable harm.
Disclosing Party shall be entitled to seek injunctive relief and specific
performance without bond, in addition to any other remedies at law or in
equity, including attorney's fees for enforcement.

9. NO WARRANTY

Confidential Information is provided "AS IS." Disclosing Party makes no
representation or warranty regarding accuracy, completeness, or
non-infringement.

10. NON-SOLICITATION

For a period of two (2) years from the Effective Date, Receiving Party
shall not directly or indirectly solicit for employment or hire any
employee, contractor, or advisor of Disclosing Party with whom Receiving
Party had substantive contact, without Disclosing Party's prior written
consent.

11. GOVERNING LAW

This Agreement is governed by the laws of Delaware. The Parties consent to
the exclusive jurisdiction of Delaware state and federal courts.

12. NO ASSIGNMENT

Receiving Party may not assign this Agreement without Disclosing Party's
prior written consent.

13. ENTIRE AGREEMENT

This Agreement constitutes the entire agreement on the subject matter and
supersedes prior discussions. Amendments must be in writing signed by both
parties.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the
Effective Date.

GENTLE REMINDER, INC.                   {{recipient_name}}

By: _______________________             By: _______________________
Name: {{founder_name}}                  Name:
Title: {{founder_title}}                Title:
Date: ___________                       Date: ___________`,
    notes: 'Use when we are the primary Disclosing Party — sharing IP docket, source code, patent claims. Stronger protections including non-compete on derivative IP and 2-year non-solicit.',
  },

  // ============================================================
  // SIMPLIFIED ONE-PAGER NDA (for fast-moving deals)
  // ============================================================
  {
    id: 'simple-nda',
    label: 'Simplified NDA (Fast-Track)',
    audience: 'Advisors, contractors, short-duration discussions',
    type: 'mutual',
    counselReviewRequired: true,
    body: `SHORT-FORM NON-DISCLOSURE AGREEMENT

Date: {{effective_date}}
Parties: Gentle Reminder, Inc. ("Company") and {{recipient_name}} ("Recipient")

1. Each party may receive confidential information ("Confidential
   Information") from the other in connection with discussions regarding
   {{purpose}}.

2. Confidential Information includes technical, business, and financial
   information, whether oral or written, that is marked or reasonably
   understood as confidential.

3. The Receiving Party will:
   (a) Keep Confidential Information confidential and use reasonable care;
   (b) Use it only for the purpose identified above;
   (c) Not disclose it to third parties except to Representatives under
       confidentiality obligations equivalent to this Agreement.

4. Excluded: information that is (a) publicly known, (b) independently
   developed, (c) rightfully received from a third party, or (d) required
   to be disclosed by law (with prompt notice to the other party).

5. Term: 2 years from signing. Confidentiality obligations survive 3 years
   post-disclosure (indefinitely for trade secrets).

6. No license granted. No obligation to proceed with any transaction.

7. Governing law: Delaware.

Signed:
{{founder_name}} (Gentle Reminder)          {{recipient_name}}
________________________                    ________________________
Date:                                        Date:`,
    notes: 'Use for low-stakes introductory discussions where full NDA is overkill. Always have counsel review before first use.',
  },
];

export function getNDAById(id: string): NDATemplate | undefined {
  return NDA_TEMPLATES.find((n) => n.id === id);
}
