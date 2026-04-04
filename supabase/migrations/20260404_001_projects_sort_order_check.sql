alter table public.projects
drop constraint if exists projects_sort_order_range_check;

alter table public.projects
add constraint projects_sort_order_range_check
check (sort_order between 0 and 9999);
