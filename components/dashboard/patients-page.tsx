"use client";

import {
  AlertDialog,
  Avatar,
  Button,
  Chip,
  Dropdown,
  EmptyState,
  Input,
  InputGroup,
  Label,
  Modal,
  Table,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";
import { useMemo, useState, type SVGProps } from "react";

import { SearchIcon } from "@/components/icons";

import {
  directoryPatients,
  patientPrograms,
  patientStatuses,
  statusColor,
  type DirectoryPatient,
  type PatientProgram,
  type PatientStatus,
} from "./data";

type ColumnId = "id" | "patient" | "program" | "status" | "actions";
type SortDirection = "ascending" | "descending";
type SortState = { column: ColumnId; direction: SortDirection };
type FilterKey =
  | "all"
  | `status:${PatientStatus}`
  | `program:${PatientProgram}`;

const toolbarButton =
  "button button--tertiary button--sm !inline-flex h-8 w-auto shrink-0 items-center justify-center gap-1.5 rounded-full px-3";

const columns: Array<{ id: ColumnId; name: string; sortable?: boolean }> = [
  { id: "id", name: "Patient ID", sortable: true },
  { id: "patient", name: "Patient", sortable: true },
  { id: "program", name: "Program", sortable: true },
  { id: "status", name: "Status", sortable: true },
  { id: "actions", name: "Actions" },
];

function Icon({
  children,
  size = 16,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {children}
    </svg>
  );
}

function FilterIcon() {
  return (
    <Icon>
      <path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z" />
    </Icon>
  );
}

function SortIcon() {
  return (
    <Icon>
      <path d="M8 6v12" />
      <path d="m5 9 3-3 3 3" />
      <path d="M16 18V6" />
      <path d="m13 15 3 3 3-3" />
    </Icon>
  );
}

function ColumnsIcon() {
  return (
    <Icon>
      <rect height="14" rx="1.5" width="5" x="4" y="5" />
      <rect height="14" rx="1.5" width="5" x="15" y="5" />
    </Icon>
  );
}

function CopyIcon() {
  return (
    <Icon size={14}>
      <rect height="10" rx="1.5" width="10" x="8" y="8" />
      <path d="M6 16H5.5A1.5 1.5 0 0 1 4 14.5V5.5A1.5 1.5 0 0 1 5.5 4H14.5A1.5 1.5 0 0 1 16 5.5V6" />
    </Icon>
  );
}

function EyeIcon() {
  return (
    <Icon>
      <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </Icon>
  );
}

function PencilIcon() {
  return (
    <Icon>
      <path d="M4 20h4l10-10-4-4L4 16v4Z" />
      <path d="m13 7 4 4" />
    </Icon>
  );
}

function TrashIcon() {
  return (
    <Icon>
      <path d="M5 7h14" />
      <path d="M9 7V5h6v2" />
      <path d="M8 7l1 12h6l1-12" />
    </Icon>
  );
}

function comparePatients(
  left: DirectoryPatient,
  right: DirectoryPatient,
  sort: SortState,
) {
  const value = (patient: DirectoryPatient) => {
    if (sort.column === "id") return patient.code;
    if (sort.column === "program") return patient.program;
    if (sort.column === "status") return patient.status;

    return patient.name;
  };
  const result = value(left).localeCompare(value(right));

  return sort.direction === "ascending" ? result : -result;
}

export function PatientsPage() {
  const [records, setRecords] = useState(directoryPatients);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortState>({
    column: "patient",
    direction: "ascending",
  });
  const [visibleIds, setVisibleIds] = useState<ColumnId[]>(
    columns.map((column) => column.id),
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<DirectoryPatient | null>(null);
  const [editing, setEditing] = useState<DirectoryPatient | null>(null);
  const [removing, setRemoving] = useState<DirectoryPatient | null>(null);

  const visibleColumns = columns.filter((column) =>
    visibleIds.includes(column.id),
  );

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records
      .filter((patient) => {
        const matchesStatus =
          !filter.startsWith("status:") ||
          patient.status === filter.slice("status:".length);
        const matchesProgram =
          !filter.startsWith("program:") ||
          patient.program === filter.slice("program:".length);
        const matchesSearch =
          query.length === 0 ||
          [
            patient.name,
            patient.email,
            patient.code,
            patient.program,
            patient.status,
            patient.condition,
          ].some((value) => value.toLowerCase().includes(query));

        return matchesStatus && matchesProgram && matchesSearch;
      })
      .sort((left, right) => comparePatients(left, right, sort));
  }, [filter, records, search, sort]);

  const copyCode = async (patient: DirectoryPatient) => {
    try {
      await navigator.clipboard.writeText(patient.code);
      setCopiedId(patient.id);
      window.setTimeout(() => setCopiedId(null), 1200);
    } catch {
      setCopiedId(null);
    }
  };

  const saveEdit = () => {
    if (!editing) return;

    setRecords((current) =>
      current.map((patient) =>
        patient.id === editing.id ? editing : patient,
      ),
    );
    setEditing(null);
  };

  const confirmRemove = () => {
    if (!removing) return;

    setRecords((current) =>
      current.filter((patient) => patient.id !== removing.id),
    );
    setRemoving(null);
  };

  const renderCell = (patient: DirectoryPatient, column: ColumnId) => {
    if (column === "id") {
      return (
        <span className="inline-flex items-center gap-1 text-muted">
          {patient.code}
          <Button
            aria-label={`Copy ${patient.code}`}
            isIconOnly
            size="sm"
            variant="ghost"
            onPress={() => copyCode(patient)}
          >
            <CopyIcon />
          </Button>
          {copiedId === patient.id ? (
            <span className="text-xs text-success">Copied</span>
          ) : null}
        </span>
      );
    }

    if (column === "patient") {
      return (
        <span className="flex items-center gap-3">
          <Avatar color={patient.color} size="sm">
            <Avatar.Fallback>{patient.initials}</Avatar.Fallback>
          </Avatar>
          <span>
            <span className="block font-medium text-foreground">
              {patient.name}
            </span>
            <span className="block text-xs text-muted">{patient.email}</span>
          </span>
        </span>
      );
    }

    if (column === "program") return patient.program;

    if (column === "status") {
      return (
        <Chip color={statusColor(patient.status)} size="sm" variant="soft">
          <Chip.Label>{patient.status}</Chip.Label>
        </Chip>
      );
    }

    return (
      <span className="inline-flex justify-end gap-1">
        <Button
          aria-label={`View ${patient.name}`}
          isIconOnly
          size="sm"
          variant="secondary"
          onPress={() => setViewing(patient)}
        >
          <EyeIcon />
        </Button>
        <Button
          aria-label={`Edit ${patient.name}`}
          isIconOnly
          size="sm"
          variant="secondary"
          onPress={() => setEditing(patient)}
        >
          <PencilIcon />
        </Button>
        <Button
          aria-label={`Delete ${patient.name}`}
          isIconOnly
          size="sm"
          variant="danger-soft"
          onPress={() => setRemoving(patient)}
        >
          <TrashIcon />
        </Button>
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">All Patients</h1>
        <Chip size="sm" variant="soft">
          <Chip.Label>{rows.length}</Chip.Label>
        </Chip>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Dropdown>
            <Dropdown.Trigger className={toolbarButton}>
              <FilterIcon />
              Filter
            </Dropdown.Trigger>
            <Dropdown.Popover placement="bottom start">
              <Dropdown.Menu
                aria-label="Filter patients"
                selectedKeys={new Set([filter])}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  const next = Array.from(keys)[0];

                  if (next) setFilter(String(next) as FilterKey);
                }}
              >
                <Dropdown.Item id="all" textValue="All patients">
                  All patients
                  <Dropdown.ItemIndicator />
                </Dropdown.Item>
                {patientStatuses.map((status) => (
                  <Dropdown.Item
                    key={status}
                    id={`status:${status}`}
                    textValue={status}
                  >
                    {status}
                    <Dropdown.ItemIndicator />
                  </Dropdown.Item>
                ))}
                {patientPrograms.map((program) => (
                  <Dropdown.Item
                    key={program}
                    id={`program:${program}`}
                    textValue={program}
                  >
                    {program}
                    <Dropdown.ItemIndicator />
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>

          <Dropdown>
            <Dropdown.Trigger className={toolbarButton}>
              <SortIcon />
              Sort
            </Dropdown.Trigger>
            <Dropdown.Popover placement="bottom start">
              <Dropdown.Menu
                aria-label="Sort patients"
                selectedKeys={new Set([sort.column])}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  const next = Array.from(keys)[0];

                  if (!next || next === "actions") return;

                  const column = String(next) as ColumnId;

                  setSort((current) => ({
                    column,
                    direction:
                      current.column === column && current.direction === "ascending"
                        ? "descending"
                        : "ascending",
                  }));
                }}
              >
                <Dropdown.Item id="patient" textValue="Patient">
                  Patient
                </Dropdown.Item>
                <Dropdown.Item id="id" textValue="Patient ID">
                  Patient ID
                </Dropdown.Item>
                <Dropdown.Item id="program" textValue="Program">
                  Program
                </Dropdown.Item>
                <Dropdown.Item id="status" textValue="Status">
                  Status
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>

          <Dropdown>
            <Dropdown.Trigger className={toolbarButton}>
              <ColumnsIcon />
              Columns
            </Dropdown.Trigger>
            <Dropdown.Popover placement="bottom start">
              <Dropdown.Menu
                aria-label="Visible columns"
                selectedKeys={new Set(visibleIds)}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                  const next = Array.from(keys).map(String) as ColumnId[];

                  if (!next.includes("patient")) next.unshift("patient");
                  setVisibleIds(columns.map((column) => column.id).filter((id) => next.includes(id)));
                }}
              >
                {columns.map((column) => (
                  <Dropdown.Item key={column.id} id={column.id} textValue={column.name}>
                    {column.name}
                    <Dropdown.ItemIndicator />
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>

        <TextField
          aria-label="Search patients"
          className="w-full max-w-xs"
          value={search}
          onChange={setSearch}
        >
          <InputGroup>
            <InputGroup.Prefix>
              <SearchIcon className="pointer-events-none text-base text-muted" />
            </InputGroup.Prefix>
            <InputGroup.Input placeholder="Search..." />
          </InputGroup>
        </TextField>
      </div>

      <Table aria-label="Patients" variant="primary">
        <Table.ScrollContainer>
          <Table.Content
            sortDescriptor={sort}
            onSortChange={(descriptor) => {
              const column = String(descriptor.column) as ColumnId;

              if (column === "actions") return;

              setSort({
                column,
                direction: descriptor.direction ?? "ascending",
              });
            }}
          >
            <Table.Header columns={visibleColumns}>
              {(column) => (
                <Table.Column
                  id={column.id}
                  allowsSorting={column.sortable}
                  isRowHeader={column.id === "patient"}
                >
                  {column.sortable
                    ? ({ sortDirection }) => (
                        <Table.SortableColumnHeader sortDirection={sortDirection}>
                          {column.name}
                        </Table.SortableColumnHeader>
                      )
                    : column.name}
                </Table.Column>
              )}
            </Table.Header>
            <Table.Body
              items={rows}
              renderEmptyState={() => (
                <EmptyState className="py-10 text-center text-sm text-muted">
                  No patients match this search or filter.
                </EmptyState>
              )}
            >
              {(patient) => (
                <Table.Row id={patient.id} columns={visibleColumns}>
                  {(column) => (
                    <Table.Cell
                      className={column.id === "actions" ? "text-end" : undefined}
                    >
                      {renderCell(patient, column.id)}
                    </Table.Cell>
                  )}
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <Modal
        isOpen={viewing !== null}
        onOpenChange={(open) => {
          if (!open) setViewing(null);
        }}
      >
        <Modal.Backdrop>
          <Modal.Container size="md">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>Patient record</Modal.Heading>
                <Modal.CloseTrigger />
              </Modal.Header>
              <Modal.Body>
                {viewing ? (
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Avatar color={viewing.color}>
                        <Avatar.Fallback>{viewing.initials}</Avatar.Fallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{viewing.name}</p>
                        <p className="text-muted">{viewing.email}</p>
                      </div>
                    </div>
                    <p>
                      <span className="text-muted">ID </span>
                      {viewing.code}
                    </p>
                    <p>
                      <span className="text-muted">Program </span>
                      {viewing.program}
                    </p>
                    <p>
                      <span className="text-muted">Status </span>
                      {viewing.status}
                    </p>
                    <p>
                      <span className="text-muted">Condition </span>
                      {viewing.condition}
                    </p>
                    <p>
                      <span className="text-muted">Latest reading </span>
                      {viewing.reading} · {viewing.device}
                    </p>
                  </div>
                ) : null}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onPress={() => setViewing(null)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <Modal
        isOpen={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <Modal.Backdrop>
          <Modal.Container size="md">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>Edit patient</Modal.Heading>
                <Modal.CloseTrigger />
              </Modal.Header>
              <Modal.Body>
                {editing ? (
                  <div className="flex flex-col gap-4">
                    <TextField
                      value={editing.name}
                      onChange={(value) =>
                        setEditing({ ...editing, name: value })
                      }
                    >
                      <Label>Name</Label>
                      <Input />
                    </TextField>
                    <TextField
                      type="email"
                      value={editing.email}
                      onChange={(value) =>
                        setEditing({ ...editing, email: value })
                      }
                    >
                      <Label>Email</Label>
                      <Input />
                    </TextField>
                    <div>
                      <p className="mb-2 text-sm text-muted">Program</p>
                      <ToggleButtonGroup
                        disallowEmptySelection
                        selectedKeys={new Set([editing.program])}
                        selectionMode="single"
                        size="sm"
                        onSelectionChange={(keys) => {
                          const next = Array.from(keys)[0];

                          if (next) {
                            setEditing({
                              ...editing,
                              program: String(next) as PatientProgram,
                            });
                          }
                        }}
                      >
                        {patientPrograms.map((program) => (
                          <ToggleButton key={program} id={program}>
                            {program}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </div>
                    <div>
                      <p className="mb-2 text-sm text-muted">Status</p>
                      <ToggleButtonGroup
                        disallowEmptySelection
                        selectedKeys={new Set([editing.status])}
                        selectionMode="single"
                        size="sm"
                        onSelectionChange={(keys) => {
                          const next = Array.from(keys)[0];

                          if (next) {
                            setEditing({
                              ...editing,
                              status: String(next) as PatientStatus,
                            });
                          }
                        }}
                      >
                        {patientStatuses.map((status) => (
                          <ToggleButton key={status} id={status}>
                            {status}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </div>
                  </div>
                ) : null}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="ghost" onPress={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button variant="primary" onPress={saveEdit}>
                  Save
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <AlertDialog
        isOpen={removing !== null}
        onOpenChange={(open) => {
          if (!open) setRemoving(null);
        }}
      >
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Heading>Remove patient</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                Remove {removing?.name} from the patient list? This only updates
                the mock directory.
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button variant="ghost" onPress={() => setRemoving(null)}>
                  Cancel
                </Button>
                <Button variant="danger" onPress={confirmRemove}>
                  Delete
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </div>
  );
}
