"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeviceModel } from "./device-models";
import { IoDocumentText } from "react-icons/io5";
import { FaMobileScreen, FaSquareCheck  } from "react-icons/fa6";
import { GrPowerReset } from "react-icons/gr";
import { useForm } from "react-hook-form";
import {
  LuChevronsUpDown,
  LuCheck
} from "react-icons/lu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ComponentsComputerOptions } from "./components";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";
import { generateTermPdf } from "./script/generate-term";
import { toast } from "sonner";

const generateTermFormSchema = z.object({
  employee: z
    .string()
    .nonempty({ message: "É obrigatório adicionar um funcionário!" })
    .min(3, { message: "O funcionário precisa ter um nome maior que 3 caracteres!" }),
  cpf: z
    .string()
    .nonempty({ message: "É obrigatório adicionar um CPF!" })
    .regex(/^\d+$/, { message: "O CPF precisa ser apenas números!" })
    .length(11, { message: "O CPF deve conter apenas 11 caracteres!" }),
  deviceModel: z.string().nonempty({ message: "É obrigatório adicionar um modelo de dispositivo!" }),
  imeiSerialDevice: z
    .string()
    .nonempty({ message: "É obrigatório adicionar um IMEI/Série do dispositivo!" })
    .length(15, { message: "O IMEI deve conter apenas 15 caracteres!" }),
  componentsComputer: z.array(z.string()),
  isBrokenScreen: z.boolean().default(false).optional(),
});

type GenerateTermFormSchema = z.infer<typeof generateTermFormSchema>;

export function GenerateTermForm() {
  const generateTermForm = useForm<GenerateTermFormSchema>({
    resolver: zodResolver(generateTermFormSchema),
    defaultValues: {
      employee: "",
      cpf: "",
      deviceModel: "",
      componentsComputer: [],
      imeiSerialDevice: "",
      isBrokenScreen: false,
    },
  });

  function handleSubmit(input: GenerateTermFormSchema) {
    toast("Termo gerado com sucesso!", {
      icon: <FaSquareCheck className="text-[#010a41]" />,
      description: "Agora você pode baixar o termo de responsabilização.",
      duration: 6000,
      style: {
        backgroundColor: "#f8f9fa",
        color: "#010a41",
        border: "1px solid #010a41",
      },
      action: {
        label: "Fechar",
        onClick: () => toast.dismiss(),
      }
    });

    const {
      componentsComputer,
      cpf,
      deviceModel,
      employee,
      imeiSerialDevice,
      isBrokenScreen } = input;

    const pdfHtml = generateTermPdf({
      cpf: cpf,
      deviceModel: deviceModel,
      employee: employee,
      imeiSerialDevice: imeiSerialDevice,
      isBrokenScreen: isBrokenScreen || false,
      components: componentsComputer ? componentsComputer.map((component) => component) : [] as any,
    });

    // const blob = new Blob([PDF], { type: "application/pdf" });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = `Termo de Responsabilização - ${employee}.pdf`;
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // URL.revokeObjectURL(url);

    const newTab = window.open();
    if (newTab) {
      newTab.document.body.innerHTML = pdfHtml;
      newTab.document.close();
    }

    generateTermForm.reset({
      employee: "",
      cpf: "",
      deviceModel: "",
      imeiSerialDevice: "",
      componentsComputer: [],
      isBrokenScreen: false,
    });
  };

  function handleResetFields() {
    generateTermForm.reset({
      employee: "",
      cpf: "",
      deviceModel: "",
      imeiSerialDevice: "",
      componentsComputer: [],
      isBrokenScreen: false,
    })
  }

  return (
    <Form {...generateTermForm}>
      <form onSubmit={generateTermForm.handleSubmit(handleSubmit)} className="space-y-8 p-8 bg-slate-50 rounded-lg shadow-sm border-none md:w-[800px] lg:w-[1000px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
        control={generateTermForm.control}
        name="employee"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Funcionário</FormLabel>
            <FormControl>
          <Input placeholder="Insira o nome completo do funcionário" {...field}></Input>
            </FormControl>
            {/* <FormDescription>
          Nome completo do funcionário que irá entregar o dispositivo.
            </FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
          />
          <FormField
        control={generateTermForm.control}
        name="cpf"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">CPF</FormLabel>
            <FormControl>
          <Input placeholder="Insira o CPF do funcionário" {...field}></Input>
            </FormControl>
            {/* <FormDescription>CPF do funcionário que irá entregar o dispositivo.</FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
          />
          <FormField
        control={generateTermForm.control}
        name="deviceModel"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Modelo do Dispositivo</FormLabel>
            <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button variant="outline" role="combobox" className={
            cn("w-[200px] justify-between", !field.value && "text-muted-foreground")}>
            {field.value
              ? DeviceModel.find((device) => device.value === field.value)?.label
              : "Selecionar modelo..."}
            <LuChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Procurar modelo..." className="h-9" />
              <CommandList>
            <CommandEmpty>Modelo não encontrado.</CommandEmpty>
            <CommandGroup>
              {DeviceModel.map((device) => (
                <CommandItem
              key={device.id}
              value={device.value}
              onSelect={() => {
                generateTermForm.setValue("deviceModel", device.value)
              }}
                >
              {device.label}
              <LuCheck
                className={cn(
                  "ml-auto",
                  device.value === field.value ? "opacity-100" : "opacity-0"
                )}
              />
                </CommandItem>
              ))}
            </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
            </Popover>
            {/* <FormDescription>Modelo do dispositivo que será entregue.</FormDescription> */}
            <FormMessage />
          </FormItem>
        )
        }
          />
          <FormField
        control={generateTermForm.control}
        name="imeiSerialDevice"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">IMEI/Série do Dispositivo</FormLabel>
            <FormControl>
          <Input placeholder="Insira o IMEI/Série do dispositivo" {...field}></Input>
            </FormControl>
            {/* <FormDescription>IMEI ou número de série do dispositivo que será entregue.</FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
          />
          <FormField
        control={generateTermForm.control}
        name="componentsComputer"
        render={() => (
          <FormItem>
            <div className="mb-4">
          <FormLabel className="font-bold">Componentes</FormLabel>
            </div>
            {ComponentsComputerOptions.map((component) => (
          <FormField
            key={component.id}
            control={generateTermForm.control}
            name="componentsComputer"
            render={({ field }) => (
              <FormItem key={component.id} className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value?.includes(component.id)}
                onCheckedChange={(checked) => {
              return checked ? field.onChange([...field.value, component.id]) : field.onChange(field.value?.filter((item) => item !== component.id));
                }}
              ></Checkbox>
            </FormControl>
            <FormLabel className="text-sm font-normal">
              {component.label}
            </FormLabel>
              </FormItem>
            )}
          ></FormField>
            ))}
          </FormItem>
        )}
          />
          <FormField
        control={generateTermForm.control}
        name="isBrokenScreen"
        render={() => (
          <div>
            <h3 className="mb-4 text-lg font-bold">Informações Adicionais</h3>
            <div className="space-y-4">
          <FormField
            control={generateTermForm.control}
            name="isBrokenScreen"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel className="font-bold">
                <FaMobileScreen className="mr-2 inline-block" />
                Tela Quebrada
              </FormLabel>
              {/* <FormDescription>
                Se o dispositivo tem a tela quebrada, selecione esta opção.
              </FormDescription> */}
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
              </FormItem>
            )}
          />
            </div>
          </div>
        )}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button type="submit" className="hover:cursor-pointer bg-[#010a41] hover:bg-[#2a3050] transition-all duration-300">
        <IoDocumentText className="mr-2" />
        Gerar Termo
          </Button >
          <Button type="button" className="hover:cursor-pointer bg-red-800 hover:bg-red-700 transition-all duration-300" onClick={handleResetFields}>
        <GrPowerReset className="mr-2" />
        Reiniciar
          </Button >
        </div>
      </form >
    </Form >
  )
}