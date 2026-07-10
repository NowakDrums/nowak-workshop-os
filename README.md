# Nowak Workshop OS v5.2.1

Adds the final Nowak drum serial number.

Behaviour:
- The serial-number panel appears only when:
  - Ownership is Nowak, and
  - The manufacturing workflow is 100% complete.
- The final Nowak serial number remains editable.
- It is saved using the normal Save Changes button.
- Once entered, the serial is also displayed on the Production card.
- Brady and Unallocated drums do not show this field.

Important:
Run `supabase/v5_2_1_migration.sql` once before deployment.
