﻿export class ExtractClaimsResponseDto {
  [key: string]: string;
}

export class ExtractClaimsMetadataDto {
  processedFiles: string[];
  processingTime: number;
  totalDocuments: number;
}
