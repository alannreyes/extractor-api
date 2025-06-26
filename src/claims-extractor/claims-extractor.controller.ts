import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { ClaimsExtractorService } from './claims-extractor.service';
import { ExtractClaimsResponseDto } from './dto/extract-claims-response.dto';

@ApiTags('Claims Extractor')
@Controller('extract-claims')
export class ClaimsExtractorController {
  constructor(private readonly claimsExtractorService: ClaimsExtractorService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({ summary: 'Extract data from legal documents dynamically' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ 
    status: 200, 
    description: 'Documents processed successfully',
    type: ExtractClaimsResponseDto 
  })
  async extractClaims(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ExtractClaimsResponseDto> {
    try {
      if (!files || files.length === 0) {
        throw new HttpException('No files provided', HttpStatus.BAD_REQUEST);
      }

      return await this.claimsExtractorService.extractFromDocuments(files);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error processing documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
