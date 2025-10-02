import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import axios from 'axios';
import 'primereact/resources/themes/saga-blue/theme.css';
import SelectionOverLay from './SelectionOverlay';

interface ArtworkData {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

interface ApiArtwork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

export default function ArtworksDataTable() {
    const [data, setData] = useState<ArtworkData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectionLength, setSelectionLength] = useState<number>(0);
    const [selectedArtworks, setSelectedArtworks] = useState<ArtworkData[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
    const totalRecords = 120;

    async function getData(pageNumber: number) {
        try {
            setLoading(true);

            const response = await axios.get(
                `https://api.artic.edu/api/v1/artworks?page=${pageNumber + 1}`
            );

            const newData = response.data.data.map((item: ApiArtwork) => {
                const { id, title, place_of_origin, artist_display, inscriptions, date_start, date_end } = item;
                return {
                    id: id || Math.random(),
                    title: title || 'N/A',
                    place_of_origin: place_of_origin || 'Unknown',
                    artist_display: artist_display || 'Unknown Artist',
                    inscriptions: inscriptions || 'None',
                    date_start: date_start || 0,
                    date_end: date_end || 0
                };
            });

            setData(newData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getData(0);
    }, []);

    useEffect(() => {
        if (!loading && data.length > 0) {
            const visibleSelections = data.filter(item => selectedIds.includes(item.id));
            setSelectedArtworks(visibleSelections);
        }
    }, [data, loading, selectedIds]);

    useEffect(() => {
        if (selectionLength > selectedIds.length) {
            const fetchSelections = async () => {
                const ids: number[] = [];
                let remaining = selectionLength;
                let page = 0;

                while (remaining > 0 && page < Math.ceil(totalRecords / 12)) {
                    try {
                        const response = await axios.get(
                            `https://api.artic.edu/api/v1/artworks?page=${page + 1}`
                        );
                        const pageData: number[] = response.data.data.map((item: ApiArtwork) => item.id);

                        const toTake = Math.min(remaining, pageData.length);
                        ids.push(...pageData.slice(0, toTake));

                        remaining -= toTake;
                        page++;
                    } catch (error) {
                        console.error("Error fetching page:", error);
                        break;
                    }
                }
                setSelectedIds(ids);
            };

            fetchSelections();
        } else if (selectionLength === 0) {
            setSelectedIds([]);
            setSelectedArtworks([]);
        }
    }, [selectionLength]);

    const handlePageChange = (event: { page: number; first: number; rows: number }) => {
        console.log('Page changed to:', event.page);
        setActiveTabIndex(event.page);
        getData(event.page);
    };

    const handleSelectionChange = (e: any) => {
        const newSelection = e.value as ArtworkData[];
        const currentPageIds = data.map(item => item.id);
        const otherPageIds = selectedIds.filter(id => !currentPageIds.includes(id));
        const newSelectedIds = newSelection.map(item => item.id);

        const updatedIds = [...otherPageIds, ...newSelectedIds];

        setSelectedIds(updatedIds);
        setSelectedArtworks(newSelection);
        setSelectionLength(updatedIds.length);
    };

    console.log("Total selected IDs:", selectedIds);

    return (
        <div className="card p-4" style={{ width: '90vw', overflow: 'auto', position: 'relative' }}>
            <DataTable
                value={data}
                loading={loading}
                showGridlines
                stripedRows
                selection={selectedArtworks}
                onSelectionChange={handleSelectionChange}
                selectionMode="multiple"
                dataKey="id"
                emptyMessage="No artworks found."
                tableStyle={{ width: '100%' }}
                className="p-datatable-sm"
                resizableColumns
                columnResizeMode="expand"
                scrollable
                scrollHeight="600px"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <Column
                    selectionMode="multiple"
                    headerStyle={{ width: '5rem' }}
                    header={() => (
                        <div className="flex items-center gap-1">
                            <SelectionOverLay
                                selectionLength={selectionLength}
                                setSelectionLength={setSelectionLength}
                            />
                        </div>
                    )}
                />
                <Column
                    field="title"
                    header="Title"
                    style={{ width: '200px', wordWrap: 'break-word', whiteSpace: 'normal' }}
                />
                <Column
                    field="place_of_origin"
                    header="Place of Origin"
                    style={{ width: '120px', wordWrap: 'break-word', whiteSpace: 'normal' }}
                />
                <Column
                    field="artist_display"
                    header="Artist"
                    style={{ width: '150px', wordWrap: 'break-word', whiteSpace: 'normal' }}
                />
                <Column
                    field="inscriptions"
                    header="Inscriptions"
                    style={{ width: '200px', wordWrap: 'break-word', whiteSpace: 'normal' }}
                />
                <Column
                    header="Date Range"
                    style={{ width: '100px', wordWrap: 'break-word', whiteSpace: 'normal' }}
                />
            </DataTable>

            <Paginator
                first={activeTabIndex * 12}
                rows={12}
                totalRecords={totalRecords}
                onPageChange={handlePageChange}
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                currentPageReportTemplate="Page {currentPage} of {totalPages}"
                pageLinkSize={10}
                className="justify-content-center"
            />
        </div>
    );
}
