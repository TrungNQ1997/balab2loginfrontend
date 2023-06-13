import { MatPaginatorIntl } from '@angular/material';

export class CustomPaginatorIntl extends MatPaginatorIntl {
    itemsPerPageLabel = 'Số dòng trên mỗi trang';
    getRangeLabel = (page: number, pageSize: number, length: number): string => {
        if (length === 0 || pageSize === 0) {
            return `0 của ${length}`;
        }

        length = Math.max(length, 0);

        const startIndex = page * pageSize;

        // Tính toán chỉ số cuối cùng
        let endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

        return `${startIndex + 1} - ${endIndex} của ${length}`;
    };
}
