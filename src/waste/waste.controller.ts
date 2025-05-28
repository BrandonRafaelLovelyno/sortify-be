import { Controller } from '@nestjs/common';
import { WasteService } from './waste.service';

@Controller('waste')
export class WasteController {
  constructor(private readonly wasteService: WasteService) {}
}
