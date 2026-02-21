import React from "react";

export type BlockType = "header" | "entry" | "contact" | "summary" | "skills" | "projects" | "custom";

export interface PaginationBlock {
    id: string;
    type: BlockType;
    element: React.ReactNode;
    height: number;
    sectionId?: string;
    sectionTitle?: string;
}

export interface PageContent {
    blocks: React.ReactNode[];
    height: number;
}

const MAX_PAGE_HEIGHT = 971; // 257mm at 3.78px/mm
const BACKFILL_THRESHOLD = 0.15 * MAX_PAGE_HEIGHT; // 15% rule

/**
 * Single-pass pagination engine with atomic blocks and anti-orphan logic.
 */
export function paginateBlocks(blocks: PaginationBlock[]): React.ReactNode[][] {
    if (blocks.length === 0) return [];

    const pages: PageContent[] = [];
    let currentPage: PageContent = { blocks: [], height: 0 };

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const nextBlock = blocks[i + 1];

        // Rule 1: Header Anchoring
        // If current block is a header, it MUST stay with at least one entry.
        // Check if header + next entry exceeds page limit.
        if (block.type === "header" && nextBlock) {
            const combinedHeight = block.height + nextBlock.height;
            if (currentPage.height + combinedHeight > MAX_PAGE_HEIGHT && currentPage.blocks.length > 0) {
                // Force new page for both header and next block
                pages.push(currentPage);
                currentPage = { blocks: [block.element], height: block.height };
                continue;
            }
        }

        // Rule 2: Entry Atomicity
        // (Handled by standard overflow check unless we decide to split bullets in the future)
        // Currently, we treat all blocks as atomic.

        if (currentPage.height + block.height > MAX_PAGE_HEIGHT && currentPage.blocks.length > 0) {
            pages.push(currentPage);
            currentPage = { blocks: [block.element], height: block.height };
        } else {
            currentPage.blocks.push(block.element);
            currentPage.height += block.height;
        }
    }

    if (currentPage.blocks.length > 0) {
        pages.push(currentPage);
    }

    // Rule 3: Anti-Orphan Remainder Rule (Backfill)
    // If the final page content height < 15% of page height:
    if (pages.length > 1) {
        const lastPage = pages[pages.length - 1];
        if (lastPage.height < BACKFILL_THRESHOLD) {
            const prevPage = pages[pages.length - 2];

            // Move ONE block from previous page if space allows
            // We take the LAST block of the previous page
            if (prevPage.blocks.length > 1) {
                // Safety check: Don't move a header if it's the last thing on prev page?
                // Actually, if we move it, it joins the orphaned entry on the last page.
                // But if the header was anchored to entries on the prev page, we might 
                // break that anchor. However, the rule says "Move ONE block".

                // For now, simple implementation:
                // We'd need the heights of individual blocks in PageContent to do this properly.
                // Let's refine the PageContent interface to track individual block heights.
            }
        }
    }

    return pages.map(p => p.blocks);
}

/**
 * Refined version of paginateBlocks that supports backfill more accurately.
 */
export function refinedPaginate(blocks: PaginationBlock[]): PaginationBlock[][] {
    if (blocks.length === 0) return [];

    const pages: { blocks: PaginationBlock[], height: number }[] = [];
    let currentPage: { blocks: PaginationBlock[], height: number } = { blocks: [], height: 0 };

    const pushPage = () => {
        pages.push({ ...currentPage });
        currentPage = { blocks: [], height: 0 };
    };

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const nextBlock = blocks[i + 1];

        // Header Anchoring: Don't leave a header alone at the bottom
        if (block.type === "header" && nextBlock && currentPage.height + block.height + nextBlock.height > MAX_PAGE_HEIGHT) {
            if (currentPage.blocks.length > 0) {
                pushPage();
            }
        }

        if (currentPage.height + block.height > MAX_PAGE_HEIGHT && currentPage.blocks.length > 0) {
            pushPage();
        }

        currentPage.blocks.push(block);
        currentPage.height += block.height;
    }

    if (currentPage.blocks.length > 0) {
        pages.push(currentPage);
    }

    // Anti-Orphan Backfill Rule
    if (pages.length > 1) {
        const lastPageIndex = pages.length - 1;
        const lastPage = pages[lastPageIndex];

        if (lastPage.height < BACKFILL_THRESHOLD) {
            const prevPage = pages[lastPageIndex - 1];

            // Only backfill if previous page has more than one block to spare
            // and the block being moved doesn't overflow the last page (unlikely if it's < 15%)
            if (prevPage.blocks.length > 1) {
                const blockToMove = prevPage.blocks[prevPage.blocks.length - 1];

                // If the block is a header, we should probably move the one before it too?
                // No, the rule says "Move ONE block". If we move a header, it stays with the entry below it.
                // If we move an entry, the header remains on the prev page with its other entries.

                if (lastPage.height + blockToMove.height <= MAX_PAGE_HEIGHT) {
                    prevPage.blocks.pop();
                    prevPage.height -= blockToMove.height;
                    lastPage.blocks.unshift(blockToMove);
                    lastPage.height += blockToMove.height;
                }
            }
        }
    }

    return pages.map(p => p.blocks);
}
